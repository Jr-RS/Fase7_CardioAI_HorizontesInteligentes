# API Handoff: CardioIA Frontend Requirements

## Contexto

Este documento define el contrato esperado entre frontend y backend para la plataforma CardioIA Fase 7.
El frontend ya fue desarrollado con datos mock y necesita alinear los endpoints reales para integración progresiva.
El objetivo es que backend y frontend trabajen en paralelo con un formato de datos consistente.

## Endpoints requeridos

### GET /dashboard/summary

- **Propósito**: obtener el resumen principal del dashboard.
- **Auth**: por definir.
- **Response success**:

```json
{
  "total_patients": 12,
  "critical_patients": 3,
  "moderate_patients": 4
}
```

- **Errores esperados**:
  - `500` error interno
- **Notas**:
  - todos los campos deben ser numéricos

### GET /patients

- **Propósito**: listar pacientes visibles en el frontend.
- **Auth**: por definir.
- **Response success**:

```json
[
  {
    "id": 1,
    "name": "João Silva",
    "age": 58,
    "gender": "Masculino",
    "status": "Crítico",
    "diagnosis": "Suspeita de IAM"
  }
]
```

- **Errores esperados**:
  - `500` error interno
- **Notas**:
  - el frontend espera una lista
  - `id` debe ser único

### GET /patients/{id}

- **Propósito**: obtener detalle básico de un paciente.
- **Auth**: por definir.
- **Response success**:

```json
{
  "id": 1,
  "name": "João Silva",
  "age": 58,
  "gender": "Masculino",
  "status": "Crítico",
  "diagnosis": "Suspeita de IAM"
}
```

- **Errores esperados**:
  - `404` paciente no encontrado
  - `500` error interno

### GET /vitals/{id}

- **Propósito**: obtener signos vitales recientes de un paciente.
- **Auth**: por definir.
- **Response success**:

```json
[
  {
    "id": 1,
    "heart_rate": 122,
    "spo2": 89,
    "systolic_bp": 85,
    "timestamp": "2026-05-24T10:00:00"
  }
]
```

- **Errores esperados**:
  - `404` paciente no encontrado
  - `500` error interno
- **Notas**:
  - el frontend espera una lista, aunque tenga un solo registro
  - `timestamp` idealmente en formato ISO 8601

### GET /risk/{id}

- **Propósito**: obtener evaluación de riesgo del paciente.
- **Auth**: por definir.
- **Response success**:

```json
{
  "patient_id": 1,
  "score": 82,
  "level": "alto",
  "reason": "High HR + low SpO2 + low BP"
}
```

- **Errores esperados**:
  - `404` paciente no encontrado
  - `500` error interno
- **Notas**:
  - `level` debería ser uno de: `bajo`, `moderado`, `alto`

### GET /monitoring/summary

- **Propósito**: obtener resumen del monitoreo global.
- **Auth**: por definir.
- **Response success**:

```json
{
  "avg_heart_rate": 96,
  "avg_spo2": 94,
  "avg_systolic_bp": 118,
  "latest_records": [
    {
      "id": 1,
      "heart_rate": 122,
      "spo2": 89,
      "systolic_bp": 85,
      "timestamp": "2026-05-24T10:00:00"
    }
  ]
}
```

- **Errores esperados**:
  - `500` error interno

### POST /chat

- **Propósito**: enviar una pregunta al asistente conversacional.
- **Auth**: por definir.
- **Request**:

```json
{
  "message": "¿Cuál es el riesgo del paciente?"
}
```

- **Response success**:

```json
{
  "reply": "El paciente presenta un nivel de riesgo alto según sus signos vitales recientes."
}
```

- **Errores esperados**:
  - `400` request inválida
  - `500` error interno

## Modelos de datos esperados

### Patient

```json
{
  "id": 1,
  "name": "string",
  "age": 58,
  "gender": "string",
  "status": "string",
  "diagnosis": "string"
}
```

### Vital

```json
{
  "id": 1,
  "heart_rate": 122,
  "spo2": 89,
  "systolic_bp": 85,
  "timestamp": "2026-05-24T10:00:00"
}
```

### Risk

```json
{
  "patient_id": 1,
  "score": 82,
  "level": "alto",
  "reason": "string"
}
```

### ChatRequest

```json
{
  "message": "string"
}
```

### ChatResponse

```json
{
  "reply": "string"
}
```

## Enums y valores esperados

| Campo | Valores |
|---|---|
| `status` | `Crítico`, `Moderado`, `Estável` |
| `level` | `alto`, `moderado`, `bajo` |

## Reglas importantes

- El frontend espera JSON válido en todos los endpoints.
- Las listas deben devolverse como arrays, no como objetos envolventes, salvo que se acuerde otro formato.
- Si un paciente no existe, el backend debe responder `404`.
- Si un campo puede venir vacío o nulo, debe avisarse antes para adaptar el frontend.
- El frontend puede trabajar temporalmente con mocks, pero necesita mantener consistencia con estos nombres de campos.

## CORS

Para pruebas locales, el backend debe permitir:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

## Escenarios de prueba

1. Listar pacientes correctamente.
2. Abrir detalle de un paciente existente.
3. Manejar `404` cuando el paciente no existe.
4. Obtener signos vitales sin romper el frontend si no hay registros.
5. Obtener evaluación de riesgo.
6. Enviar una pregunta al chat y recibir una respuesta de texto.
7. Cargar dashboard y monitoreo sin errores de formato.

## Dudas por confirmar

- Si habrá autenticación o no.
- Si los nombres de campos se mantendrán exactamente así.
- Si se agregará paginación en `/patients`.
- Si el chat devolverá solo `reply` o más metadatos.
