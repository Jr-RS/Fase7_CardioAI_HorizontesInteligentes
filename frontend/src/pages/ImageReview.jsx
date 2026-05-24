export default function ImageReview() {
  return (
    <div>
      <div className="card">
        <h2>Revisión de imágenes</h2>
        <p className="muted">
          Espacio para integrar el análisis de radiografías y recuperación de casos similares.
        </p>
      </div>

      <div className="card">
        <p>Subida de imagen:</p>
        <input type="file" />
        <p className="muted" style={{ marginTop: "12px" }}>
          Resultado demo: imagen compatible con casos de interés clínico.
        </p>
      </div>
    </div>
  );
}