import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../services/patientService";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError("No se pudo cargar la lista de pacientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <LoadingState message="Cargando lista de pacientes..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <section className="page-section">
        <div className="card">
          <h2>Pacientes</h2>
          <p className="muted">Listado general de pacientes para el flujo clínico.</p>
        </div>
      </section>

      {patients.map((patient) => (
        <div className="card" key={patient.id}>
          <h3>{patient.name}</h3>
          <p>Edad: {patient.age}</p>
          <p>Sexo: {patient.gender}</p>
          <p>Estado: {patient.status}</p>
          <p>Diagnóstico: {patient.diagnosis}</p>

          <Link
            to={`/patients/${patient.id}`}
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "white"
            }}
          >
            Ver detalle
          </Link>
        </div>
      ))}
    </div>
  );
}