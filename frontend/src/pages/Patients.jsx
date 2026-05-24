import { mockPatients } from "../data/mockPatients";

export default function Patients() {
  return (
    <div>
      <section className="page-section">
        <div className="card">
          <h2>Pacientes</h2>
          <p className="muted">Listado general de pacientes para el flujo clínico.</p>
        </div>
      </section>

      {mockPatients.map((patient) => (
        <div className="card" key={patient.id}>
          <h3>{patient.name}</h3>
          <p>Edad: {patient.age}</p>
          <p>Sexo: {patient.gender}</p>
          <p>Estado: {patient.status}</p>
          <p>Diagnóstico: {patient.diagnosis}</p>
        </div>
      ))}
    </div>
  );
}