import { api } from "./api";

export async function getPatients() {
  const response = await api.get("/patients");
  return response.data;
}

export async function getPatientById(id) {
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
}