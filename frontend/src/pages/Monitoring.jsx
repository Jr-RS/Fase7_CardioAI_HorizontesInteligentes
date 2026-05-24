import StatCard from "../components/common/StatCard";

export default function Monitoring() {
  return (
    <div>
      <section className="page-section">
        <div className="card">
          <h2>Monitoreo</h2>
          <p className="muted">Visualización académica de señales vitales y alertas.</p>
        </div>
      </section>

      <section className="card-grid">
        <StatCard title="Heart Rate promedio" value="96 bpm" subtitle="Datos simulados" />
        <StatCard title="SpO2 promedio" value="94%" subtitle="Última lectura" />
        <StatCard title="Presión sistólica" value="118" subtitle="Media del día" />
      </section>
    </div>
  );
}