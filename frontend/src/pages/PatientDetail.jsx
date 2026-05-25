import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPatientById } from "../services/patientService";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

export default function PatientDetail() {
    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [vitals, setVitals] = useState([]);
    const [risk, setRisk] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPatientById(id);
                setPatient(data.patient);
                setVitals(data.vitals);
                setRisk(data.risk);
            } catch (err) {
                setError(err.message || "No se pudo cargar el paciente.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

    if (loading) {
        return <LoadingState message="Cargando detalle del paciente..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div>
            <div className="card">
                <Link to="/patients" style={{ color: "#2563eb" }}>← Volver a pacientes</Link>
                <h2 style={{ marginTop: "12px" }}>{patient.name}</h2>
                <p>Edad: {patient.age}</p>
                <p>Sexo: {patient.gender}</p>
                <p>Estado actual: {patient.status}</p>
                <p>Diagnóstico: {patient.diagnosis}</p>
            </div>

            <div className="card">
                <h3>Riesgo clínico</h3>
                {risk ? (
                    <>
                        <p><span className="badge">Nivel: {risk.level}</span></p>
                        <p>Score: {risk.score}</p>
                        <p>Motivo: {risk.reason}</p>
                    </>
                ) : (
                    <p className="muted">No hay evaluación de riesgo disponible.</p>
                )}
            </div>

            <div className="card">
                <h3>Signos vitales recientes</h3>
                {vitals.length > 0 ? (
                    vitals.map((item) => (
                        <div key={item.id} style={{ marginBottom: "14px" }}>
                            <p>HR: {item.heart_rate} bpm</p>
                            <p>SpO2: {item.spo2}%</p>
                            <p>Presión sistólica: {item.systolic_bp}</p>
                            <small className="muted">{item.timestamp}</small>
                        </div>
                    ))
                ) : (
                    <p className="muted">No hay registros de signos vitales.</p>
                )}
            </div>
            <div className="card">
                <h3>Acciones sugeridas</h3>
                <ul>
                    <li>Revisar signos vitales recientes.</li>
                    <li>Evaluar riesgo cardiovascular actual.</li>
                    <li>Consultar examen de imagen si está disponible.</li>
                </ul>
            </div>
        </div>
    );
}