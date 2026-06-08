from __future__ import annotations

from pathlib import Path
from typing import Dict

import joblib
import pandas as pd

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_PATH = MODEL_DIR / "modelo_cardio_best.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"


def _load_model_and_scaler():
    if not MODEL_PATH.exists() or not SCALER_PATH.exists():
        raise FileNotFoundError("Model artifacts not found.")

    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
    return scaler, model


def _build_features(paciente: Dict, scaler) -> pd.DataFrame:
    idade = float(paciente["idade"])
    bpm = float(paciente["bpm"])
    spo2 = float(paciente["spo2"])
    pressao_sistolica = float(paciente["pressao_sistolica"])
    carga_sistema = float(paciente["carga_sistema"])
    tempo_sintomas = float(paciente["tempo_sintomas"])

    indice_gravidade = bpm / max(spo2, 1.0)
    pressao_pulso = pressao_sistolica - 60.0
    carga_por_tempo = carga_sistema / (tempo_sintomas + 1.0)

    dados_9features = pd.DataFrame(
        [[
            idade,
            bpm,
            spo2,
            pressao_sistolica,
            carga_sistema,
            tempo_sintomas,
            indice_gravidade,
            pressao_pulso,
            carga_por_tempo,
        ]],
        columns=[
            "idade",
            "bpm",
            "spo2",
            "pressao_sistolica",
            "carga_sistema",
            "tempo_sintomas",
            "indice_gravidade",
            "pressao_pulso",
            "carga_por_tempo",
        ],
    )

    dados_scaled = pd.DataFrame(scaler.transform(dados_9features), columns=dados_9features.columns)

    if idade <= 40:
        faixa_idade_jovem, faixa_idade_adulto, faixa_idade_idoso = 1.0, 0.0, 0.0
    elif idade <= 60:
        faixa_idade_jovem, faixa_idade_adulto, faixa_idade_idoso = 0.0, 1.0, 0.0
    else:
        faixa_idade_jovem, faixa_idade_adulto, faixa_idade_idoso = 0.0, 0.0, 1.0

    if spo2 <= 90:
        faixa_spo2_baixa, faixa_spo2_media, faixa_spo2_alta = 1.0, 0.0, 0.0
    elif spo2 <= 95:
        faixa_spo2_baixa, faixa_spo2_media, faixa_spo2_alta = 0.0, 1.0, 0.0
    else:
        faixa_spo2_baixa, faixa_spo2_media, faixa_spo2_alta = 0.0, 0.0, 1.0

    dummies = pd.DataFrame(
        [[
            faixa_idade_jovem,
            faixa_idade_adulto,
            faixa_idade_idoso,
            faixa_spo2_baixa,
            faixa_spo2_media,
            faixa_spo2_alta,
        ]],
        columns=[
            "faixa_idade_jovem",
            "faixa_idade_adulto",
            "faixa_idade_idoso",
            "faixa_spo2_baixa",
            "faixa_spo2_media",
            "faixa_spo2_alta",
        ],
    )

    return pd.concat([dados_scaled, dummies], axis=1)


def _classify(probability: float) -> str:
    if probability > 0.80:
        return "alto"
    if probability >= 0.50:
        return "moderado"
    return "bajo"


def _reason_from_vitals(paciente: Dict) -> str:
    reasons = []
    if paciente["bpm"] >= 110:
        reasons.append("High HR")
    if paciente["spo2"] <= 92:
        reasons.append("Low SpO2")
    if paciente["pressao_sistolica"] <= 90:
        reasons.append("Low BP")

    if reasons:
        return " + ".join(reasons)
    return "Stable vitals"


def calculate_risk(paciente: Dict) -> Dict:
    try:
        scaler, model = _load_model_and_scaler()
        features = _build_features(paciente, scaler)
        probability = float(model.predict_proba(features)[0][1])
    except Exception:
        probability = 0.65

    score = round(probability * 100)
    return {
        "score": score,
        "level": _classify(probability),
        "reason": _reason_from_vitals(paciente),
    }
