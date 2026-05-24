export function getMockChatResponse(message) {
  const text = message.toLowerCase();

  if (text.includes("riesgo")) {
    return "El paciente presenta un nivel de riesgo según sus signos vitales recientes.";
  }

  if (text.includes("ecg")) {
    return "El ECG debe realizarse lo antes posible en casos sospechosos de IAM.";
  }

  if (text.includes("spo2")) {
    return "Una saturación baja puede indicar compromiso respiratorio y requiere atención.";
  }

  return "Soy el asistente académico de CardioIA y puedo responder sobre riesgo, signos vitales y flujo clínico.";
}