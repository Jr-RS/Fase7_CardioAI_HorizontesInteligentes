import { useState } from "react";
import { getMockChatResponse } from "../data/mockChat";

export default function ChatAssistant() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const handleSend = () => {
        if (!message.trim()) return;
        const reply = getMockChatResponse(message);
        setResponse(reply);
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
                    Enviar
                </button>

                {response && (
                    <div style={{ marginTop: "16px" }}>
                        <strong>Respuesta:</strong>
                        <p>{response}</p>
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