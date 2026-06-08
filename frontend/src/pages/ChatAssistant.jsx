import { useState } from "react";
import { sendChatMessage } from "../services/cardioService";

export default function ChatAssistant() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;

        try {
            setLoading(true);
            setError("");
            const data = await sendChatMessage(message);
            setResponse(data.reply || "");
        } catch (err) {
            setError("No se pudo obtener respuesta del asistente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card">
                <h2>Chat IA</h2>
                <p className="muted">Asistente conversacional para apoyo clínico académico.</p>
            </div>

            <div className="card">
                <textarea
                    rows="5"
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                    placeholder="Escribe tu pregunta..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
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
                    {loading ? "Enviando..." : "Enviar"}
                </button>

                {error && (
                    <div style={{ marginTop: "12px" }}>
                        <strong>Error:</strong>
                        <p>{error}</p>
                    </div>
                )}

                {response && (
                    <div style={{ marginTop: "16px" }}>
                        <strong>Respuesta:</strong>
                        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{response}</p>
                    </div>
                )}
            </div>
            <div className="card">
                <h3>Preguntas sugeridas</h3>
                <ul>
                    <li>¿Cuál es el riesgo del paciente?</li>
                    <li>¿Qué significa una SpO2 baja?</li>
                    <li>¿Qué examen debe priorizarse en sospecha de IAM?</li>
                </ul>
            </div>
        </div>
    );
}