from __future__ import annotations

import json
import os
import re
import unicodedata

import requests

from . import data_store, risk_engine

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
GEMINI_BASE_URL = os.getenv(
    "GEMINI_URL",
    "https://generativelanguage.googleapis.com/v1beta/models",
)
SYSTEM_PROMPT = (
    "Voce e o assistente academico CardioIA, um apoio informativo para uma plataforma de "
    "monitoramento cardiovascular. Sua funcao e EXCLUSIVAMENTE consultar e explicar os dados "
    "cadastrados na base local de pacientes (dados demograficos, sinais vitais e o nivel de "
    "risco calculado pelo sistema).\n\n"
    "ESCOPO PERMITIDO (responda somente isto):\n"
    "1. Resumir ou descrever os dados de um paciente que exista na base local.\n"
    "2. Explicar o nivel de risco calculado e os sinais vitais registrados desse paciente.\n"
    "3. Esclarecer, de forma geral e educativa, o significado de indicadores (ex.: o que e SpO2, "
    "frequencia cardiaca, pressao sistolica) sem dar conduta medica.\n\n"
    "REGRAS OBRIGATORIAS:\n"
    "- Use SOMENTE os dados fornecidos no contexto clinico local. Nunca invente dados nem use "
    "conhecimento externo sobre o paciente.\n"
    "- NUNCA forneca diagnostico definitivo, prescricao, dosagem, conduta de emergencia ou "
    "recomendacao de tratamento. Isso e responsabilidade do medico responsavel.\n"
    "- Se a pergunta mencionar um paciente que NAO esta no contexto, responda exatamente que o "
    "paciente nao foi localizado na base local e que so e possivel responder sobre pacientes "
    "cadastrados.\n"
    "- Se a pergunta estiver FORA do escopo permitido (pedido de prescricao/conduta, assunto nao "
    "clinico, dados pessoais que nao temos, ou qualquer coisa alem dos dados cadastrados), "
    "RECUSE educadamente com a frase: 'Nao tenho dados nem autorizacao para responder esse tipo "
    "de solicitacao. Posso ajudar apenas com os dados de pacientes cadastrados na plataforma "
    "CardioIA.'\n\n"
    "FORMATO: responda SEMPRE em texto simples (plain text), em portugues, de forma direta e "
    "concisa. NAO use Markdown: nada de asteriscos, ** para negrito, # para titulos ou - para "
    "listas. Se precisar enumerar, use frases curtas separadas por ponto."
)


class ChatProviderError(RuntimeError):
    pass


# Alias de compatibilidade: código/testes existentes importam OpenAIChatError.
OpenAIChatError = ChatProviderError


def _normalize_text(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    normalized = "".join(character for character in normalized if not unicodedata.combining(character))
    return normalized.lower()


def _find_patient_in_message(message: str):
    normalized = _normalize_text(message)

    match = re.search(r"\b(?:paciente|patient)\s*(\d+)\b", normalized)
    if match:
        patient = data_store.get_patient(int(match.group(1)))
        if patient:
            return patient

    for patient in data_store.PATIENTS:
        patient_name = _normalize_text(patient["name"])
        if patient_name in normalized:
            return patient

    return None


def _latest_vitals(patient_id: int):
    vitals = data_store.list_vitals(patient_id)
    return vitals[-1] if vitals else None


def _build_patient_data(patient: dict) -> dict:
    latest = _latest_vitals(patient["id"])
    if latest:
        return {
            "idade": patient["age"],
            "bpm": latest.heart_rate,
            "spo2": latest.spo2,
            "pressao_sistolica": latest.systolic_bp,
            "carga_sistema": patient["carga_sistema"],
            "tempo_sintomas": patient["tempo_sintomas"],
        }

    status_normalized = _normalize_text(patient["status"])
    if status_normalized == "critico":
        bpm, spo2, systolic_bp = 122, 89, 85
    elif status_normalized == "moderado":
        bpm, spo2, systolic_bp = 101, 94, 110
    else:
        bpm, spo2, systolic_bp = 82, 97, 120

    return {
        "idade": patient["age"],
        "bpm": bpm,
        "spo2": spo2,
        "pressao_sistolica": systolic_bp,
        "carga_sistema": patient["carga_sistema"],
        "tempo_sintomas": patient["tempo_sintomas"],
    }


def _build_patient_context(patient: dict) -> tuple[str, dict]:
    all_vitals = data_store.list_vitals(patient["id"])
    patient_data = _build_patient_data(patient)
    risk = risk_engine.calculate_risk(patient_data)

    if all_vitals:
        history_lines = [
            f"- {v.timestamp}: FC {v.heart_rate} bpm, SpO2 {v.spo2}%, PA sistolica {v.systolic_bp} mmHg"
            for v in all_vitals
        ]
        vitals_text = (
            "Historico de sinais vitais registrados ("
            f"{len(all_vitals)} leitura(s)):\n" + "\n".join(history_lines)
        )
    else:
        vitals_text = "Nao ha sinais vitais registrados para este paciente."

    context = (
        "Dados cadastrais do paciente:\n"
        f"- Nome: {patient['name']}\n"
        f"- ID: {patient['id']}\n"
        f"- Idade: {patient['age']} anos\n"
        f"- Sexo: {patient['gender']}\n"
        f"- Status: {patient['status']}\n"
        f"- Diagnostico: {patient['diagnosis']}\n"
        f"- Carga do sistema: {patient['carga_sistema']}\n"
        f"- Tempo de sintomas: {patient['tempo_sintomas']} h\n\n"
        f"{vitals_text}\n\n"
        "Risco calculado pelo sistema (modelo XGBoost): "
        f"nivel {risk['level']}, score {risk['score']}, motivo: {risk['reason']}."
    )
    return context, risk


def _build_system_instruction(patient: dict | None) -> str:
    """Monta a instrução de sistema (Gemini) com o prompt base e o contexto clínico."""
    parts = [SYSTEM_PROMPT]

    if patient:
        context, _ = _build_patient_context(patient)
        parts.append(
            "Contexto clinico local estruturado. Responda somente com base nele e na pergunta. "
            f"{context}"
        )
    else:
        parts.append(
            "Nenhum paciente especifico foi identificado. "
            "Se o usuario pedir um paciente pelo nome ou id, responda que o paciente nao foi localizado na base local."
        )

    return "\n\n".join(parts)


def _extract_error_message(response: requests.Response) -> str:
    try:
        payload = response.json()
        error = payload.get("error", {}) if isinstance(payload, dict) else {}
        code = error.get("status") or error.get("code") or "unknown_error"
        message = error.get("message") or response.text
        return f"Gemini {response.status_code} ({code}): {message}"
    except Exception:
        return f"Gemini {response.status_code}: {response.text}"


def get_chat_reply(message: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ChatProviderError("GEMINI_API_KEY nao configurada")

    patient = _find_patient_in_message(message)
    payload = {
        "system_instruction": {
            "parts": [{"text": _build_system_instruction(patient)}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": message}],
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 800,
            "thinkingConfig": {
                "thinkingBudget": 0,
            },
        },
    }

    url = f"{GEMINI_BASE_URL}/{MODEL_NAME}:generateContent"
    response = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        params={"key": api_key},
        data=json.dumps(payload),
        timeout=30,
    )

    if not response.ok:
        raise ChatProviderError(_extract_error_message(response))

    data = response.json()
    candidates = data.get("candidates") if isinstance(data, dict) else None
    if not candidates:
        raise ChatProviderError("Gemini respondeu sem candidates")

    first = candidates[0]
    content_obj = first.get("content") if isinstance(first, dict) else None
    parts = content_obj.get("parts") if isinstance(content_obj, dict) else None
    if not parts:
        finish = first.get("finishReason") if isinstance(first, dict) else None
        raise ChatProviderError(
            f"Gemini respondeu sem content.parts (finishReason={finish})"
        )

    # Concatena todos os fragmentos de texto, ignorando partes sem texto.
    text = "".join(
        part.get("text", "")
        for part in parts
        if isinstance(part, dict) and part.get("text")
    ).strip()
    if not text:
        raise ChatProviderError("Gemini respondeu sem conteudo textual")

    return _strip_markdown(text)


def _strip_markdown(text: str) -> str:
    """Remove marcacoes Markdown comuns para exibir como texto simples na UI."""
    # Negrito/italico: **texto**, __texto__, *texto*, _texto_
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"__(.+?)__", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    # Titulos markdown no inicio de linha (# ...)
    text = re.sub(r"(?m)^\s*#{1,6}\s*", "", text)
    # Marcadores de lista no inicio de linha (-, *, +) -> remove o bullet
    text = re.sub(r"(?m)^\s*[-*+]\s+", "", text)
    # Asteriscos remanescentes soltos
    text = text.replace("*", "")
    return text.strip()
