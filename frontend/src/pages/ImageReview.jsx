import { useEffect, useState } from "react";
import { analyzeImage } from "../services/cardioService";

export default function ImageReview() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Gera (e libera) a URL de pré-visualização da imagem selecionada.
    useEffect(() => {
        if (!file) {
            setPreviewUrl("");
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleFileChange = (event) => {
        const selected = event.target.files?.[0] || null;
        setFile(selected);
        setResult(null);
        setError("");
    };

    const handleAnalyze = async () => {
        if (!file) return;

        try {
            setLoading(true);
            setError("");
            const data = await analyzeImage(file);
            setResult(data);
        } catch (err) {
            setError("No se pudo analizar la imagen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card">
                <h2>Revisión de imágenes</h2>
                <p className="muted">
                    Análisis de radiografías con el modelo de visión (TensorFlow).
                </p>
            </div>

            <div className="card">
                <p>Subida de imagen:</p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {previewUrl && (
                    <div style={{ marginTop: "16px" }}>
                        <p className="muted" style={{ marginBottom: "8px" }}>
                            Imagen seleccionada:
                        </p>
                        <img
                            src={previewUrl}
                            alt="Radiografía seleccionada para análisis"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "320px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                display: "block",
                            }}
                        />
                    </div>
                )}

                <button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    style={{
                        marginTop: "12px",
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#2563eb",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    {loading ? "Analizando..." : "Analizar"}
                </button>
                {error && (
                    <p className="muted" style={{ marginTop: "12px" }}>{error}</p>
                )}
            </div>

            <div className="card">
                <h3>Resultado</h3>
                {result ? (
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "flex-start" }}>
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Imagen analizada"
                                style={{
                                    width: "200px",
                                    height: "auto",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                }}
                            />
                        )}
                        <div>
                            <p style={{ fontWeight: 600, fontSize: "18px", margin: "0 0 8px" }}>
                                {result.label}
                            </p>
                            <p className="muted" style={{ margin: 0 }}>
                                Probabilidad: {(result.probability * 100).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="muted">Suba una imagen para ver el análisis.</p>
                )}
            </div>
        </div>
    );
}
