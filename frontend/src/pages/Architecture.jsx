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
    </div>
  );
}