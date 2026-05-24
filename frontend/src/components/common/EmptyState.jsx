export default function EmptyState({ title = "Sin datos", message = "No hay información disponible." }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="muted">{message}</p>
    </div>
  );
}