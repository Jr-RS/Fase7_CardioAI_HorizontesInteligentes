import { useEffect, useState } from "react";
import StatCard from "../components/common/StatCard";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import { getMonitoringSummary } from "../services/cardioService";

export default function Monitoring() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMonitoringSummary();
        setSummary(data);
      } catch (err) {
        setError("No se pudo cargar el monitoreo.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <LoadingState message="Cargando monitoreo..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const avgHeartRate = summary?.avg_heart_rate ?? 0;
  const avgSpO2 = summary?.avg_spo2 ?? 0;
  const avgSystolic = summary?.avg_systolic_bp ?? 0;
  const latestRecords = summary?.latest_records ?? [];

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
        {latestRecords.length > 0 ? (
          latestRecords.map((item) => (
            <div key={item.id} style={{ marginBottom: "12px" }}>
              <p>HR: {item.heart_rate} | SpO2: {item.spo2} | BP: {item.systolic_bp}</p>
              <small className="muted">{item.timestamp}</small>
            </div>
          ))
        ) : (
          <p className="muted">No hay registros recientes.</p>
        )}
      </div>
    </div>
  );
}