from __future__ import annotations

import io

from dotenv import load_dotenv

# Carrega variáveis do arquivo .env em desenvolvimento local. Em produção (Render),
# as variáveis vêm do ambiente do serviço; load_dotenv não sobrescreve as já definidas.
load_dotenv()

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from . import chat_engine, data_store, image_engine, risk_engine
from .chat_engine import ChatProviderError
from .models import (
    ChatRequest,
    ChatResponse,
    DashboardSummary,
    ImageAnalysisResponse,
    IoTVitalIn,
    MonitoringSummary,
    Patient,
    Risk,
    Vital,
)

app = FastAPI(title="CardioIA Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/dashboard/summary", response_model=DashboardSummary)
async def get_dashboard_summary():
    return data_store.dashboard_summary()


@app.get("/patients", response_model=list[Patient])
async def get_patients():
    return data_store.list_patients()


@app.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: int):
    patient = data_store.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente nao encontrado.")
    return patient


@app.get("/vitals/{patient_id}", response_model=list[Vital])
async def get_vitals(patient_id: int):
    patient = data_store.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente nao encontrado.")
    return data_store.list_vitals(patient_id)


@app.get("/risk/{patient_id}", response_model=Risk)
async def get_risk(patient_id: int):
    patient = data_store.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente nao encontrado.")

    vitals = data_store.list_vitals(patient_id)
    if vitals:
        latest = vitals[-1]
        paciente_dados = {
            "idade": patient["age"],
            "bpm": latest.heart_rate,
            "spo2": latest.spo2,
            "pressao_sistolica": latest.systolic_bp,
            "carga_sistema": patient["carga_sistema"],
            "tempo_sintomas": patient["tempo_sintomas"],
        }
    else:
        paciente_dados = {
            "idade": patient["age"],
            "bpm": 90,
            "spo2": 96,
            "pressao_sistolica": 120,
            "carga_sistema": patient["carga_sistema"],
            "tempo_sintomas": patient["tempo_sintomas"],
        }

    risk = risk_engine.calculate_risk(paciente_dados)
    return {
        "patient_id": patient_id,
        "score": risk["score"],
        "level": risk["level"],
        "reason": risk["reason"],
    }


@app.get("/monitoring/summary", response_model=MonitoringSummary)
async def get_monitoring_summary():
    return data_store.monitoring_summary()


@app.post("/chat", response_model=ChatResponse)
async def post_chat(payload: ChatRequest):
    try:
        reply = chat_engine.get_chat_reply(payload.message)
    except ChatProviderError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"reply": reply}


@app.post("/iot/vitals", response_model=Vital)
async def post_iot_vitals(payload: IoTVitalIn):
    patient = data_store.get_patient(payload.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente nao encontrado.")

    return data_store.add_vital(
        patient_id=payload.patient_id,
        heart_rate=payload.heart_rate,
        spo2=payload.spo2,
        systolic_bp=payload.systolic_bp,
        timestamp=payload.timestamp,
    )


@app.post("/images/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem.")

    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Imagem invalida: {exc}") from exc

    label, probability = image_engine.analyze_image(image)
    return {"label": label, "probability": probability}
