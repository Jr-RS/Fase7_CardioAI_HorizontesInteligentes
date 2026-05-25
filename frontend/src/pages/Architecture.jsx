export default function Architecture() {
  return (
    <div>
      <div className="card">
        <h2>Arquitectura del proyecto</h2>
        <p className="muted">
          Vista resumida del ecosistema CardioIA como plataforma integrada.
        </p>
      </div>

      <div className="card">
        <ul>
          <li>Frontend web en React + Vite.</li>
          <li>Backend API para pacientes, riesgo, chat y monitoreo.</li>
          <li>Módulo de análisis visual de imágenes.</li>
          <li>Módulo conversacional asistido por IA.</li>
          <li>Despliegue web en la nube para acceso remoto.</li>
        </ul>
      </div>

      <div className="card">
        <h3>Datos necesarios del backend</h3>
        <ul>
          <li>GET /patients → lista de pacientes.</li>
          <li>GET /patients/:id → detalle de paciente.</li>
          <li>GET /vitals/:id → signos vitales por paciente.</li>
          <li>GET /risk/:id → score y nivel de riesgo.</li>
          <li>POST /chat → respuesta del asistente.</li>
        </ul>
      </div>
    </div>
  );
}