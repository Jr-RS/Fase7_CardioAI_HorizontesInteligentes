import StatCard from "../components/common/StatCard";
import { mockPatients } from "../data/mockPatients";

export default function Dashboard() {
  const totalPatients = mockPatients.length;
  const criticalPatients = mockPatients.filter((p) => p.status === "Crítico").length;
  const moderatePatients = mockPatients.filter((p) => p.status === "Moderado").length;

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
        <StatCard title="Pacientes monitorados" value={totalPatients} subtitle="Base académica demo" />
        <StatCard title="Pacientes críticos" value={criticalPatients} subtitle="Estado crítico" />
        <StatCard title="Pacientes moderados" value={moderatePatients} subtitle="Seguimiento activo" />
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