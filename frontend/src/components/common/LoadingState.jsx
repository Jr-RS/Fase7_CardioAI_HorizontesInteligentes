export default function LoadingState({ message = "Cargando datos..." }) {
  return (
    <div className="card">
      <h3>Cargando</h3>
      <p className="muted">{message}</p>
    </div>
  );
}