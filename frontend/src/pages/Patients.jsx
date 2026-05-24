export default function Patients() {
  return (
    <div>
      <section className="page-section">
        <div className="card">
          <h2>Pacientes</h2>
          <p className="muted">Listado general de pacientes para el flujo clínico.</p>
        </div>
      </section>

      <div className="card">
        <h3>João Silva</h3>
        <p>Edad: 58</p>
        <p>Estado: Crítico</p>
        <p>Diagnóstico: Sospecha de IAM</p>
      </div>

      <div className="card">
        <h3>Maria Souza</h3>
        <p>Edad: 67</p>
        <p>Estado: Estable</p>
        <p>Diagnóstico: Monitoreo preventivo</p>
      </div>
    </div>
  );
}