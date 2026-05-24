import StatCard from "../components/common/StatCard";
import { mockVitals } from "../data/mockVitals";

export default function Monitoring() {
  const allVitals = Object.values(mockVitals).flat();

  const avgHeartRate = Math.round(
    allVitals.reduce((sum, item) => sum + item.heart_rate, 0) / allVitals.length
  );

  const avgSpO2 = Math.round(
    allVitals.reduce((sum, item) => sum + item.spo2, 0) / allVitals.length
  );

  const avgSystolic = Math.round(
    allVitals.reduce((sum, item) => sum + item.systolic_bp, 0) / allVitals.length
  );

  return (
    <div>
      <section className="page-section">
        <div className="card">
          <h2>Monitoreo</h2>
          <p className="muted">Visualización académica de señales vitales y alertas.</p>
        </div>
      </section>

      <section className="card-grid">
        <StatCard title="Heart Rate promedio" value={`${avgHeartRate} bpm`} subtitle="Datos simulados" />
        <StatCard title="SpO2 promedio" value={`${avgSpO2}%`} subtitle="Última lectura" />
        <StatCard title="Presión sistólica promedio" value={avgSystolic} subtitle="Media del día" />
      </section>

      <div className="card">
        <h3>Últimos registros</h3>
        {allVitals.map((item) => (
          <div key={item.id} style={{ marginBottom: "12px" }}>
            <p>HR: {item.heart_rate} | SpO2: {item.spo2} | BP: {item.systolic_bp}</p>
            <small className="muted">{item.timestamp}</small>
          </div>
        ))}
      </div>
    </div>
  );
}