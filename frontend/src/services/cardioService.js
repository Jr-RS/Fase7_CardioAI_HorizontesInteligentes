import { api } from "./api";
import { mockPatients } from "../data/mockPatients";
import { mockVitals } from "../data/mockVitals";
import { mockRisk } from "../data/mockRisk";
import { getMockChatResponse } from "../data/mockChat";

// --- Helpers de fallback (derivam mocks de src/data/) ---

function buildMockDashboardSummary() {
  const critical = mockPatients.filter((p) => p.status === "Crítico").length;
  const moderate = mockPatients.filter((p) => p.status === "Moderado").length;
  return {
    total_patients: mockPatients.length,
    critical_patients: critical,
    moderate_patients: moderate,
  };
}

function buildMockMonitoringSummary() {
  const records = Object.values(mockVitals).flat();
  const count = records.length || 1;
  const sum = (key) => records.reduce((acc, r) => acc + (r[key] || 0), 0);
  const round = (value) => Math.round((value + Number.EPSILON) * 10) / 10;

  return {
    avg_heart_rate: round(sum("heart_rate") / count),
    avg_spo2: round(sum("spo2") / count),
    avg_systolic_bp: round(sum("systolic_bp") / count),
    latest_records: records.slice(-5),
  };
}

function buildMockRisk(id) {
  return (
    mockRisk[id] || {
      patient_id: Number(id),
      score: 0,
      level: "bajo",
      reason: "Dados mock indisponíveis para este paciente",
    }
  );
}

// --- Serviços com estratégia try/backend -> catch/mock ---

export async function getDashboardSummary() {
  try {
    const response = await api.get("/dashboard/summary");
    return response.data;
  } catch {
    return buildMockDashboardSummary();
  }
}

export async function getMonitoringSummary() {
  try {
    const response = await api.get("/monitoring/summary");
    return response.data;
  } catch {
    return buildMockMonitoringSummary();
  }
}

export async function getPatients() {
  try {
    const response = await api.get("/patients");
    return response.data;
  } catch {
    return mockPatients;
  }
}

export async function getPatientById(id) {
  try {
    const [patient, vitals, risk] = await Promise.all([
      api.get(`/patients/${id}`),
      api.get(`/vitals/${id}`),
      api.get(`/risk/${id}`),
    ]);

    return {
      patient: patient.data,
      vitals: vitals.data,
      risk: risk.data,
    };
  } catch {
    return {
      patient: mockPatients.find((p) => p.id === Number(id)) || null,
      vitals: mockVitals[id] || [],
      risk: buildMockRisk(id),
    };
  }
}

export async function sendChatMessage(message) {
  try {
    const response = await api.post("/chat", { message });
    return response.data;
  } catch {
    return { reply: getMockChatResponse(message) };
  }
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/images/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
