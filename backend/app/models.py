from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class Patient(BaseModel):
    id: int
    name: str
    age: int
    gender: str
    status: str
    diagnosis: str


class Vital(BaseModel):
    id: int
    heart_rate: int
    spo2: int
    systolic_bp: int
    timestamp: str


class Risk(BaseModel):
    patient_id: int
    score: int
    level: str
    reason: str


class DashboardSummary(BaseModel):
    total_patients: int
    critical_patients: int
    moderate_patients: int


class MonitoringSummary(BaseModel):
    avg_heart_rate: int
    avg_spo2: int
    avg_systolic_bp: int
    latest_records: List[Vital]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    reply: str


class IoTVitalIn(BaseModel):
    patient_id: int
    heart_rate: int
    spo2: int
    systolic_bp: int
    timestamp: Optional[str] = None


class ImageAnalysisResponse(BaseModel):
    label: str
    probability: float
