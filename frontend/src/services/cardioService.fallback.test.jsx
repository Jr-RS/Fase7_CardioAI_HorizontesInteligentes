import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock da camada `api` para forçar erro em todas as chamadas HTTP.
// Cada método rejeita, simulando o Backend_CardioIA indisponível (cold start do Render).
vi.mock("../services/api", () => {
  const rejected = () => Promise.reject(new Error("network error"));
  return {
    api: {
      get: vi.fn(rejected),
      post: vi.fn(rejected),
    },
  };
});

import { api } from "../services/api";
import {
  getDashboardSummary,
  getPatients,
  getPatientById,
  getMonitoringSummary,
  sendChatMessage,
} from "../services/cardioService";
import { mockPatients } from "../data/mockPatients";
import { mockVitals } from "../data/mockVitals";
import { mockRisk } from "../data/mockRisk";
import Patients from "../pages/Patients";

// Teste de exemplo para o fallback de dados mock (R1.6).
// Com a camada `api` forçando erro, `cardioService` deve retornar os dados mock
// de `src/data/` e a página deve renderizar sem `ErrorState`.

describe("cardioService fallback para dados mock (R1.6)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPatients retorna os pacientes mock quando o backend falha", async () => {
    const result = await getPatients();

    expect(api.get).toHaveBeenCalledWith("/patients");
    expect(result).toEqual(mockPatients);
  });

  it("getDashboardSummary retorna resumo derivado dos mocks quando o backend falha", async () => {
    const result = await getDashboardSummary();

    expect(result.total_patients).toBe(mockPatients.length);
    expect(result.critical_patients).toBe(
      mockPatients.filter((p) => p.status === "Crítico").length
    );
    expect(result.moderate_patients).toBe(
      mockPatients.filter((p) => p.status === "Moderado").length
    );
  });

  it("getMonitoringSummary retorna métricas derivadas dos mocks quando o backend falha", async () => {
    const result = await getMonitoringSummary();

    expect(result).toHaveProperty("avg_heart_rate");
    expect(result).toHaveProperty("avg_spo2");
    expect(result).toHaveProperty("avg_systolic_bp");
    expect(Array.isArray(result.latest_records)).toBe(true);
  });

  it("getPatientById retorna paciente, vitals e risk mock quando o backend falha", async () => {
    const result = await getPatientById(1);

    expect(result.patient).toEqual(mockPatients.find((p) => p.id === 1));
    expect(result.vitals).toEqual(mockVitals[1]);
    expect(result.risk).toEqual(mockRisk[1]);
  });

  it("sendChatMessage retorna resposta mock quando o backend falha", async () => {
    const result = await sendChatMessage("¿Cuál es el riesgo del paciente?");

    expect(api.post).toHaveBeenCalledWith("/chat", {
      message: "¿Cuál es el riesgo del paciente?",
    });
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(0);
  });

  it("a página Patients renderiza os dados mock sem exibir ErrorState", async () => {
    render(
      <MemoryRouter>
        <Patients />
      </MemoryRouter>
    );

    // Aguarda o carregamento e a renderização dos pacientes mock.
    await waitFor(() => {
      expect(screen.getByText(mockPatients[0].name)).toBeInTheDocument();
    });

    // O ErrorState renderiza um título "Error"; ele NÃO deve aparecer.
    expect(screen.queryByText("Error")).not.toBeInTheDocument();

    // Todos os pacientes mock devem estar presentes.
    mockPatients.forEach((patient) => {
      expect(screen.getByText(patient.name)).toBeInTheDocument();
    });
  });
});
