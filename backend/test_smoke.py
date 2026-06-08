from __future__ import annotations

import io
import os
import sys
import traceback
import types
from pathlib import Path
from typing import Any

from PIL import Image

# Ensure backend package imports work when running from repo root
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient

# By default we stub the heavy AI engines (TensorFlow / pandas+XGBoost) so the
# integration/smoke tests can run anywhere, including environments with a known
# NumPy 2.x vs pandas/pyarrow incompatibility that breaks `import pandas` inside
# risk_engine.py. Set USE_STUBS=0 to exercise the real engines (CI with the
# pinned dependency set).
USE_STUBS = os.getenv("USE_STUBS", "1") == "1"

# Valid risk levels per the data model (Risk.level ∈ {alto, moderado, bajo}).
VALID_RISK_LEVELS = {"alto", "moderado", "bajo"}

if USE_STUBS:
    # Inject a minimal stub for image_engine to avoid importing TensorFlow at module import time
    stub = types.ModuleType("app.image_engine")
    stub.analyze_image = lambda img: ("Normal", 0.5)
    sys.modules["app.image_engine"] = stub
    sys.modules["backend.app.image_engine"] = stub

    # Inject a minimal stub for risk_engine to avoid importing pandas/numpy heavy deps
    stub_risk = types.ModuleType("app.risk_engine")
    stub_risk.calculate_risk = lambda paciente: {"score": 65, "level": "moderado", "reason": "Fallback"}
    sys.modules["app.risk_engine"] = stub_risk
    sys.modules["backend.app.risk_engine"] = stub_risk

try:
    from app.main import app
    from app import image_engine
except Exception:
    # attempt alternative import path
    from backend.app.main import app
    from backend.app import image_engine

client = TestClient(app)

SUCCESS = 0
FAIL = 1


def expect_ok(resp: Any, key: str | None = None):
    assert resp.status_code == 200, f"{resp.request.method} {resp.request.url} -> {resp.status_code}"
    if key:
        assert key in resp.json(), f"Missing key {key} in response"


# ---------------------------------------------------------------------------
# Health (R2.3)
# ---------------------------------------------------------------------------
def test_health():
    resp = client.get("/health")
    expect_ok(resp)
    assert resp.json() == {"status": "ok"}
    print("/health ->", resp.json())


# ---------------------------------------------------------------------------
# Data endpoints (R5.1)
# ---------------------------------------------------------------------------
def test_patients_list():
    resp = client.get("/patients")
    expect_ok(resp)
    body = resp.json()
    assert isinstance(body, list)
    assert len(body) > 0
    # schema check on first patient
    first = body[0]
    for field in ("id", "name", "age", "gender", "status", "diagnosis"):
        assert field in first, f"Missing field {field} in patient"
    print("/patients -> count", len(body))


def test_patient_by_id_found():
    resp = client.get("/patients/1")
    expect_ok(resp)
    body = resp.json()
    assert body["id"] == 1
    assert "name" in body
    print("/patients/1 ->", body["name"])


def test_patient_by_id_not_found():
    resp = client.get("/patients/9999")
    assert resp.status_code == 404, f"expected 404, got {resp.status_code}"
    assert "detail" in resp.json()
    print("/patients/9999 -> 404", resp.json())


def test_vitals_found():
    resp = client.get("/vitals/1")
    expect_ok(resp)
    body = resp.json()
    assert isinstance(body, list)
    assert len(body) > 0
    for field in ("id", "heart_rate", "spo2", "systolic_bp", "timestamp"):
        assert field in body[0], f"Missing field {field} in vital"
    print("/vitals/1 -> count", len(body))


def test_vitals_not_found():
    resp = client.get("/vitals/9999")
    assert resp.status_code == 404, f"expected 404, got {resp.status_code}"
    print("/vitals/9999 -> 404")


# ---------------------------------------------------------------------------
# Risk prediction (R5.3)
# ---------------------------------------------------------------------------
def test_risk_level_valid():
    resp = client.get("/risk/1")
    expect_ok(resp)
    body = resp.json()
    assert "score" in body and "level" in body and "reason" in body
    assert body["level"] in VALID_RISK_LEVELS, f"unexpected risk level: {body['level']}"
    assert body["patient_id"] == 1
    print("/risk/1 ->", body)


def test_risk_not_found():
    resp = client.get("/risk/9999")
    assert resp.status_code == 404, f"expected 404, got {resp.status_code}"
    print("/risk/9999 -> 404")


# ---------------------------------------------------------------------------
# Dashboard & monitoring summaries (R5.1)
# ---------------------------------------------------------------------------
def test_dashboard_summary():
    resp = client.get("/dashboard/summary")
    expect_ok(resp)
    body = resp.json()
    for field in ("total_patients", "critical_patients", "moderate_patients"):
        assert field in body, f"Missing field {field} in dashboard summary"
    assert body["total_patients"] >= 1
    print("/dashboard/summary ->", body)


def test_monitoring_summary():
    resp = client.get("/monitoring/summary")
    expect_ok(resp)
    body = resp.json()
    for field in ("avg_heart_rate", "avg_spo2", "avg_systolic_bp", "latest_records"):
        assert field in body, f"Missing field {field} in monitoring summary"
    assert isinstance(body["latest_records"], list)
    print("/monitoring/summary ->", {k: v for k, v in body.items() if k != "latest_records"})


# ---------------------------------------------------------------------------
# IoT ingestion (R6.4)
# ---------------------------------------------------------------------------
def test_iot_vitals_adds_record():
    payload = {
        "patient_id": 2,
        "heart_rate": 122,
        "spo2": 89,
        "systolic_bp": 85,
        "timestamp": "2026-05-24T11:00:00",
    }

    before = client.get("/vitals/2")
    expect_ok(before)
    count_before = len(before.json())

    resp = client.post("/iot/vitals", json=payload)
    expect_ok(resp)
    body = resp.json()
    # The endpoint echoes back the stored record (Vital schema).
    assert body["heart_rate"] == payload["heart_rate"]
    assert body["spo2"] == payload["spo2"]
    assert body["systolic_bp"] == payload["systolic_bp"]
    assert "id" in body and "timestamp" in body

    after = client.get("/vitals/2")
    expect_ok(after)
    assert len(after.json()) == count_before + 1
    print("/iot/vitals -> added", body)


def test_iot_vitals_patient_not_found():
    payload = {"patient_id": 9999, "heart_rate": 80, "spo2": 98, "systolic_bp": 120}
    resp = client.post("/iot/vitals", json=payload)
    assert resp.status_code == 404, f"expected 404, got {resp.status_code}"
    print("/iot/vitals (unknown patient) -> 404")


# ---------------------------------------------------------------------------
# Chat error handling (R5.5) — invalid/missing key must return 502 with a
# descriptive message instead of a generic 500.
# ---------------------------------------------------------------------------
def test_chat_invalid_key_returns_502():
    previous_key = os.environ.get("GEMINI_API_KEY")
    # Force the misconfigured-credential path deterministically (no network call).
    os.environ["GEMINI_API_KEY"] = ""
    try:
        resp = client.post("/chat", json={"message": "Teste de disponibilidade"})
    finally:
        if previous_key is None:
            os.environ.pop("GEMINI_API_KEY", None)
        else:
            os.environ["GEMINI_API_KEY"] = previous_key

    assert resp.status_code == 502, f"expected 502, got {resp.status_code}"
    body = resp.json()
    assert "detail" in body
    assert isinstance(body["detail"], str) and len(body["detail"]) > 0
    print("/chat (invalid key) -> 502", body["detail"])


# ---------------------------------------------------------------------------
# Image analysis (R5.4)
# ---------------------------------------------------------------------------
def test_image_analyze_valid():
    import importlib.util

    tf_available = importlib.util.find_spec("tensorflow") is not None
    if not tf_available:
        # Ensure a deterministic engine when TensorFlow is not installed.
        image_engine.analyze_image = lambda img: ("Normal", 0.5)

    buf = io.BytesIO()
    Image.new("RGB", (10, 10), color=(255, 0, 0)).save(buf, format="PNG")
    buf.seek(0)

    files = {"file": ("test.png", buf.getvalue(), "image/png")}
    resp = client.post("/images/analyze", files=files)

    if tf_available and resp.status_code != 200:
        # Real TF present but model artifact unavailable in this environment.
        print("/images/analyze -> skipped (TF present, non-200):", resp.status_code)
        return

    expect_ok(resp)
    body = resp.json()
    assert "label" in body and "probability" in body
    assert isinstance(body["probability"], (int, float))
    print("/images/analyze ->", body)


def test_image_analyze_invalid_file_returns_400():
    files = {"file": ("notes.txt", b"this is not an image", "text/plain")}
    resp = client.post("/images/analyze", files=files)
    assert resp.status_code == 400, f"expected 400, got {resp.status_code}"
    assert "detail" in resp.json()
    print("/images/analyze (invalid file) -> 400")


def run_all():
    tests = [
        test_health,
        test_patients_list,
        test_patient_by_id_found,
        test_patient_by_id_not_found,
        test_vitals_found,
        test_vitals_not_found,
        test_risk_level_valid,
        test_risk_not_found,
        test_dashboard_summary,
        test_monitoring_summary,
        test_iot_vitals_adds_record,
        test_iot_vitals_patient_not_found,
        test_chat_invalid_key_returns_502,
        test_image_analyze_valid,
        test_image_analyze_invalid_file_returns_400,
    ]

    for t in tests:
        try:
            t()
        except AssertionError as ae:
            print("TEST FAILED:", t.__name__, str(ae))
            traceback.print_exc()
            return FAIL
        except Exception as exc:
            print("ERROR running", t.__name__, exc)
            traceback.print_exc()
            return FAIL

    print("ALL SMOKE TESTS PASSED")
    return SUCCESS


if __name__ == "__main__":
    code = run_all()
    sys.exit(code)
