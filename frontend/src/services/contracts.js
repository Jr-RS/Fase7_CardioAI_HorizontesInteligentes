export const contracts = {
  dashboardSummary: {
    total_patients: "number",
    critical_patients: "number",
    moderate_patients: "number",
  },
  patient: {
    id: "number",
    name: "string",
    age: "number",
    gender: "string",
    status: "string",
    diagnosis: "string",
  },
  vital: {
    id: "number",
    heart_rate: "number",
    spo2: "number",
    systolic_bp: "number",
    timestamp: "string",
  },
  risk: {
    patient_id: "number",
    score: "number",
    level: "string",
    reason: "string",
  },
  chatRequest: {
    message: "string",
  },
  chatResponse: {
    reply: "string",
  },
};