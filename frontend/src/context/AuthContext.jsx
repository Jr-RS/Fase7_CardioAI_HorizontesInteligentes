import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "cardioia_auth";

const AuthContext = createContext(null);

function readPersistedAuth() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return false;
    }
    const parsed = JSON.parse(raw);
    return Boolean(parsed?.isAuthenticated);
  } catch {
    return false;
  }
}

function persistAuth(isAuthenticated) {
  try {
    if (isAuthenticated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated: true }));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // sessionStorage indisponivel (modo privado/SSR): segue apenas com estado em memoria
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(readPersistedAuth);

  // Login_Mock: sem backend de autenticacao. Concede acesso quando os campos
  // de credencial estiverem preenchidos (R4.1, R4.2).
  const login = useCallback((credentials = {}) => {
    const username = String(credentials.username ?? "").trim();
    const password = String(credentials.password ?? "").trim();

    if (!username || !password) {
      persistAuth(false);
      setIsAuthenticated(false);
      return false;
    }

    persistAuth(true);
    setIsAuthenticated(true);
    return true;
  }, []);

  // Logout: limpa o estado persistido e retorna a aplicacao ao estado nao autenticado (R4.4).
  const logout = useCallback(() => {
    persistAuth(false);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export default AuthContext;
