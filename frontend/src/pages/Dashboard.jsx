import { useEffect, useState } from "react";
import StatCard from "../components/common/StatCard";
import ErrorState from "../components/common/ErrorState";
import LoadingState from "../components/common/LoadingState";
import { getDashboardSummary } from "../services/cardioService";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getDashboardSummary();
                setSummary(data);
            } catch (err) {
                setError("No se pudo cargar el resumen del dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <LoadingState message="Cargando resumen del dashboard..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    const totalPatients = summary?.total_patients ?? 0;
    const criticalPatients = summary?.critical_patients ?? 0;
    const moderatePatients = summary?.moderate_patients ?? 0;

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

            <section className="page-section">
                <div className="card">
                    <h3>Alertas recientes</h3>
                    <p className="muted">Paciente João Silva con riesgo alto por SpO2 baja y FC elevada.</p>
                    <p className="muted">Paciente Ana Pereira con alerta de arritmia y monitoreo continuo.</p>
                </div>
            </section>
        </div>
    );
}