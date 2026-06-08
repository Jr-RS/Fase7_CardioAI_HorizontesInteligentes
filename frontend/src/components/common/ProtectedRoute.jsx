import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

// Protege as rotas internas: enquanto o usuario nao tiver feito o Login_Mock,
// qualquer tentativa de acesso e redirecionada para /login (R4.3).
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
