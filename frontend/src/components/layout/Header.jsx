import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Logout: encerra o Login_Mock e retorna o usuario a tela de login (R4.4).
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div>
        <p className="header-subtitle">Plataforma Académica</p>
        <h1 className="header-title">CardioIA Dashboard</h1>
      </div>

      <div className="header-user">
        <span>Usuario: Carlos</span>
        <button type="button" className="button-primary" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
