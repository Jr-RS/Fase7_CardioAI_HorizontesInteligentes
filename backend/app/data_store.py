from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List, Optional

from .models import Patient, Vital

PATIENTS: List[dict] = [
    {
        "id": 1,
        "name": "Joao Silva",
        "age": 58,
        "gender": "Masculino",
        "status": "Crítico",
        "diagnosis": "Suspeita de IAM",
        "carga_sistema": 8.5,
        "tempo_sintomas": 12,
    },
    {
        "id": 2,
        "name": "Maria Souza",
        "age": 67,
        "gender": "Feminino",
        "status": "Estável",
        "diagnosis": "Monitoramento preventivo",
        "carga_sistema": 4.2,
        "tempo_sintomas": 6,
    },
    {
        "id": 3,
        "name": "Carlos Lima",
        "age": 61,
        "gender": "Masculino",
        "status": "Moderado",
        "diagnosis": "Dor toracica em avaliacao",
        "carga_sistema": 6.1,
        "tempo_sintomas": 10,
    },
    {
        "id": 4,
        "name": "Ana Pereira",
        "age": 73,
        "gender": "Feminino",
        "status": "Crítico",
        "diagnosis": "Arritmia e baixa saturacao",
        "carga_sistema": 9.0,
        "tempo_sintomas": 18,
    },
    {
        "id": 5,
        "name": "Roberto Alves",
        "age": 49,
        "gender": "Masculino",
        "status": "Estável",
        "diagnosis": "Avaliacao pos-atendimento",
        "carga_sistema": 3.7,
        "tempo_sintomas": 4,
    },
]

VITALS_BY_PATIENT: Dict[int, List[dict]] = {
    1: [
        {
            "id": 1,
            "heart_rate": 122,
            "spo2": 89,
            "systolic_bp": 85,
            "timestamp": "2026-05-24T10:00:00",
        },
        {
            "id": 2,
            "heart_rate": 118,
            "spo2": 90,
            "systolic_bp": 88,
            "timestamp": "2026-05-24T10:05:00",
        },
    ],
    2: [
        {
            "id": 3,
            "heart_rate": 82,
            "spo2": 97,
            "systolic_bp": 120,
            "timestamp": "2026-05-24T10:00:00",
        }
    ],
    3: [
        {
            "id": 4,
            "heart_rate": 101,
            "spo2": 94,
            "systolic_bp": 110,
            "timestamp": "2026-05-24T10:10:00",
        }
    ],
}


def list_patients() -> List[Patient]:
    return [Patient(**patient) for patient in PATIENTS]


def get_patient(patient_id: int) -> Optional[dict]:
    return next((patient for patient in PATIENTS if patient["id"] == patient_id), None)


def list_vitals(patient_id: int) -> List[Vital]:
    records = VITALS_BY_PATIENT.get(patient_id, [])
    return [Vital(**record) for record in records]


def add_vital(
    patient_id: int,
    heart_rate: int,
    spo2: int,
    systolic_bp: int,
    timestamp: Optional[str] = None,
) -> Vital:
    records = VITALS_BY_PATIENT.setdefault(patient_id, [])
    next_id = max((record["id"] for record in records), default=0) + 1

    if not timestamp:
        timestamp = datetime.now(timezone.utc).isoformat()

    vital = {
        "id": next_id,
        "heart_rate": heart_rate,
        "spo2": spo2,
        "systolic_bp": systolic_bp,
        "timestamp": timestamp,
    }
    records.append(vital)
    return Vital(**vital)


def dashboard_summary() -> dict:
    total = len(PATIENTS)
    critical = sum(1 for patient in PATIENTS if patient["status"] == "Crítico")
    moderate = sum(1 for patient in PATIENTS if patient["status"] == "Moderado")
    return {
        "total_patients": total,
        "critical_patients": critical,
        "moderate_patients": moderate,
    }


def monitoring_summary() -> dict:
    all_vitals = [record for records in VITALS_BY_PATIENT.values() for record in records]

    if not all_vitals:
        return {
            "avg_heart_rate": 0,
            "avg_spo2": 0,
            "avg_systolic_bp": 0,
            "latest_records": [],
        }

    avg_heart_rate = round(sum(item["heart_rate"] for item in all_vitals) / len(all_vitals))
    avg_spo2 = round(sum(item["spo2"] for item in all_vitals) / len(all_vitals))
    avg_systolic = round(sum(item["systolic_bp"] for item in all_vitals) / len(all_vitals))

    latest_records = sorted(all_vitals, key=lambda item: item["timestamp"], reverse=True)[:6]

    return {
        "avg_heart_rate": avg_heart_rate,
        "avg_spo2": avg_spo2,
        "avg_systolic_bp": avg_systolic,
        "latest_records": [Vital(**item) for item in latest_records],
    }
