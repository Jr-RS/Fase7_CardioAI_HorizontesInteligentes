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

            <div className="card">
                <h3>Resultado demo</h3>
                <p className="muted">
                    El sistema podrá recuperar estudios similares a partir de embeddings visuales.
                </p>
                <p className="muted">
                    En esta versión mock, se simula la identificación de casos clínicamente relacionados.
                </p>
            </div>
        </div>
    );
}