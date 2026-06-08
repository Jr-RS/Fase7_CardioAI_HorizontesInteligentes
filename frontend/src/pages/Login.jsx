import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Destino apos o login: rota interna originalmente solicitada ou o dashboard.
    const redirectTo = location.state?.from?.pathname || "/";

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        const success = login({ username, password });
        if (!success) {
            setError("Informe usuário e senha para acessar a plataforma.");
            return;
        }

        navigate(redirectTo, { replace: true });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f3f6fb",
                padding: "24px"
            }}
        >
            <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="page-title" style={{ fontSize: "26px" }}>
                    CardioIA
                </h1>
                <p className="muted" style={{ marginTop: 0 }}>
                    Acesse a plataforma de monitoreo cardiovascular.
                </p>

                <form onSubmit={handleSubmit}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }} htmlFor="username">
                        Usuário
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Digite seu usuário"
                        autoComplete="username"
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            marginBottom: "16px"
                        }}
                    />

                    <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }} htmlFor="password">
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Digite sua senha"
                        autoComplete="current-password"
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            marginBottom: "16px"
                        }}
                    />

                    {error && (
                        <p style={{ color: "#991b1b", marginTop: 0, marginBottom: "16px" }}>{error}</p>
                    )}

                    <button type="submit" className="button-primary" style={{ width: "100%" }}>
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
