import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

// Mock da camada `api` para forçar o fallback de dados mock nas páginas internas.
// Assim os testes de fluxo de login não dependem do Backend_CardioIA real.
vi.mock("./services/api", () => {
  const rejected = () => Promise.reject(new Error("network error"));
  return {
    api: {
      get: vi.fn(rejected),
      post: vi.fn(rejected),
    },
  };
});

import { AuthProvider } from "./context/AuthContext";
import App from "./App";

// Testes de UI do fluxo de Login_Mock (R4.2, R4.3, R4.4).
// Usam MemoryRouter para controlar a rota inicial e validar o redirecionamento.

function renderApp(initialEntries) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );
}

// Identifica a tela de login pela presença do botão "Entrar".
function loginScreenIsVisible() {
  return screen.queryByRole("button", { name: /entrar/i }) !== null;
}

describe("Fluxo de Login_Mock (R4)", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("redireciona para /login ao acessar uma rota interna sem autenticação (R4.3)", () => {
    renderApp(["/patients"]);

    // Sem login, a rota protegida deve exibir a tela de login.
    expect(loginScreenIsVisible()).toBe(true);
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it("após preencher credenciais e fazer login, a rota interna é acessível (R4.2)", async () => {
    const user = userEvent.setup();
    renderApp(["/patients"]);

    // Começa na tela de login (redirecionado de /patients).
    expect(loginScreenIsVisible()).toBe(true);

    await user.type(screen.getByLabelText(/usuário/i), "carlos");
    await user.type(screen.getByLabelText(/senha/i), "senha123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    // Após o login, a área interna deve ser acessível (o Header do MainLayout aparece).
    await waitFor(() => {
      expect(screen.getByText(/CardioIA Dashboard/i)).toBeInTheDocument();
    });

    // A tela de login não deve mais estar visível.
    expect(loginScreenIsVisible()).toBe(false);
  });

  it("logout retorna o usuário à tela de login (R4.4)", async () => {
    const user = userEvent.setup();
    renderApp(["/patients"]);

    // Autentica para acessar a área interna.
    await user.type(screen.getByLabelText(/usuário/i), "carlos");
    await user.type(screen.getByLabelText(/senha/i), "senha123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/CardioIA Dashboard/i)).toBeInTheDocument();
    });

    // Aciona o logout pelo botão "Sair" do Header.
    await user.click(screen.getByRole("button", { name: /sair/i }));

    // Deve retornar à tela de login.
    await waitFor(() => {
      expect(loginScreenIsVisible()).toBe(true);
    });
  });
});
