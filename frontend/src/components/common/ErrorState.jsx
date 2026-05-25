export default function ErrorState({ message = "Ocurrió un error al cargar los datos." }) {
  return (
    <div className="card">
      <h3>Error</h3>
      <p className="muted">{message}</p>
    </div>
  );
}