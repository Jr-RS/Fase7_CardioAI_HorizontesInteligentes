import { mockPatients } from "../data/mockPatients";
import { mockVitals } from "../data/mockVitals";
import { mockRisk } from "../data/mockRisk";

export async function getPatients() {
  return Promise.resolve(mockPatients);
}

export async function getPatientById(id) {
  const patient = mockPatients.find((p) => p.id === Number(id));
  if (!patient) {
    throw new Error("Paciente no encontrado.");
  }

  return Promise.resolve({
    patient,
    vitals: mockVitals[id] || [],
    risk: mockRisk[id] || null,
  });
}