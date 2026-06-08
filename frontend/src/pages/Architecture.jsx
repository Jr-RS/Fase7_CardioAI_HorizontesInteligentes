// URL pública do projeto do Dispositivo_IoT publicado no Wokwi (R6.5 / R8.7).
const WOKWI_PROJECT_URL = "https://wokwi.com/projects/464629362761551873";
// Wokwi permite incorporar o player da simulação via iframe usando o sufixo "?embed=1".
const WOKWI_EMBED_URL = `${WOKWI_PROJECT_URL}?embed=1`;

export default function Architecture() {
  return (
    <div>
      <div className="card">
        <h2>Arquitectura del proyecto</h2>
        <p className="muted">
          Vista integrada del ecosistema CardioIA: del sensor IoT al backend de IA y
          las interfaces web y móvil.
        </p>
      </div>

      <div className="card">
        <h3>Flujo de datos</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Sensor → MicroPython → Backend Python → APIs de IA → UI
        </p>
        <ul>
          <li>Dispositivo IoT (MicroPython / Wokwi): lectura de signos vitales y análisis local.</li>
          <li>Backend API (FastAPI): pacientes, riesgo, chat, monitoreo e ingesta IoT.</li>
          <li>APIs de IA: XGBoost (riesgo), LLM OpenAI (chat) y TensorFlow (imagen).</li>
          <li>Frontend web (React + Vite) y App móvil (Expo WebView) como capa de interfaz.</li>
        </ul>
      </div>

      <div className="card">
        <h3>Dispositivo IoT en vivo (Wokwi)</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Simulación del dispositivo de monitoreo de signos vitales publicada en Wokwi.
          Inicie la simulación con el botón ▶ dentro del simulador.
        </p>

        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "62%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            background: "#0f172a",
          }}
        >
          <iframe
            title="Dispositivo IoT CardioIA - Wokwi"
            src={WOKWI_EMBED_URL}
            allow="fullscreen; clipboard-write; serial"
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>

        <p style={{ marginBottom: 0, marginTop: "12px" }}>
          <a
            href={WOKWI_PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button-primary"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Abrir proyecto en Wokwi ↗
          </a>
        </p>
      </div>

      <div className="card">
        <h3>Datos necesarios del backend</h3>
        <ul>
          <li>GET /patients → lista de pacientes.</li>
          <li>GET /patients/:id → detalle de paciente.</li>
          <li>GET /vitals/:id → signos vitales por paciente.</li>
          <li>GET /risk/:id → score y nivel de riesgo.</li>
          <li>POST /chat → respuesta del asistente.</li>
          <li>POST /iot/vitals → ingesta de signos vitales del dispositivo IoT.</li>
        </ul>
      </div>
    </div>
  );
}
