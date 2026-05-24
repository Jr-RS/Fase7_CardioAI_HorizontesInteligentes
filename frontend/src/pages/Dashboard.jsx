import StatCard from "../components/common/StatCard";

export default function Dashboard() {
  return (
    <div>
      <section className="page-section">
        <div className="card">
          <h2>Resumen general</h2>
          <p className="muted">
            Plataforma integrada para monitoreo, riesgo, análisis visual y asistencia conversacional.
          </p>
        </div>
      </section>

      <section className="card-grid">
        <StatCard title="Pacientes monitorados" value="12" subtitle="Base académica demo" />
        <StatCard title="Alertas activas" value="3" subtitle="Riesgo moderado/alto" />
        <StatCard title="Exámenes analizados" value="18" subtitle="Módulo visual" />
      </section>

      <section className="page-section">
        <div className="card">
          <h3>Estado del sistema</h3>
          <p className="muted">
            El frontend centraliza la navegación de todos los módulos principales del proyecto CardioIA.
          </p>
        </div>
      </section>
    </div>
  );
}