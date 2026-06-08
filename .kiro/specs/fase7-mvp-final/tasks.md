# Implementation Plan: CardioIA — Fase 7 (MVP Final)

## Overview

A implementação fecha as lacunas de entrega identificadas no design, reaproveitando o código existente. O trabalho concentra-se em: endurecimento da integração do backend (CORS e erro do chat), Login_Mock e fallback de dados no Frontend_Web, arquivos de configuração de deploy (Vercel/EAS), App_Mobile (Expo WebView), Dispositivo_IoT (MicroPython/Wokwi), segurança da Chave_OpenAI e os entregáveis de documentação (diagrama, README, relatório e roteiro).

Linguagens por componente (conforme o design):
- Backend_CardioIA: Python (FastAPI) em `backend/app/`
- Frontend_Web: JavaScript/JSX (React + Vite) em `frontend/src/`
- App_Mobile: JavaScript (Expo/React Native) em `mobile/`
- Dispositivo_IoT: MicroPython em `iot/`
- Configurações e diagramas: JSON / Markdown (Mermaid)

Conforme o design, **Property-Based Testing não se aplica** a este escopo (entrega/integração/configuração/documentação). Os testes são de smoke, integração e exemplo/UI.

> Tarefas como executar o deploy na Vercel/Render, rodar o EAS Build, gerar o PDF e gravar/publicar o vídeo são ações manuais fora do escopo de um agente de código. As tarefas abaixo produzem apenas os artefatos de código, configuração e conteúdo necessários para essas ações.

## Tasks

- [x] 1. Endurecer a integração do Backend_CardioIA
  - [x] 1.1 Atualizar configuração de CORS em `backend/app/main.py`
    - Adicionar `allow_origin_regex=r"https://.*\.vercel\.app"` ao `CORSMiddleware` mantendo as origens locais
    - Garantir `allow_methods=["*"]` e `allow_headers=["*"]`
    - _Requirements: 2.4_

  - [x] 1.2 Tratar erro do chat em `backend/app/main.py`
    - Importar `OpenAIChatError` de `chat_engine`
    - Envolver `chat_engine.get_chat_reply` em try/except no handler `POST /chat`
    - Levantar `HTTPException(status_code=502, detail=str(exc))` com mensagem descritiva
    - _Requirements: 5.5_

  - [x]* 1.3 Estender testes de integração/smoke do backend em `backend/test_smoke.py`
    - Usar `fastapi.testclient.TestClient`
    - Validar `GET /health` (200), endpoints de dados (`/patients`, `/patients/{id}` 200 e 404, `/vitals/{id}`, `/risk/{id}` com `level ∈ {alto, moderado, bajo}`, `/dashboard/summary`, `/monitoring/summary`)
    - Validar `POST /iot/vitals` adiciona e retorna um registro
    - Validar `POST /chat` com chave inválida retorna 502 com mensagem descritiva
    - Validar `POST /images/analyze` retorna `{label, probability}` e 400 para arquivo inválido
    - _Requirements: 2.3, 5.1, 5.2, 5.3, 5.4, 5.5, 6.4_

- [x] 2. Checkpoint — Garantir que os testes do backend passam
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implementar Login_Mock no Frontend_Web
  - [x] 3.1 Criar `frontend/src/context/AuthContext.jsx`
    - Prover `{ isAuthenticated, login(credentials), logout() }`
    - Persistir estado em `sessionStorage` (chave `cardioia_auth`)
    - Conceder acesso quando os campos de credencial estiverem preenchidos (sem backend de auth)
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 3.2 Criar `frontend/src/pages/Login.jsx`
    - Formulário de credenciais que chama `login()` e redireciona para a área interna
    - _Requirements: 4.2_

  - [x] 3.3 Criar `frontend/src/components/common/ProtectedRoute.jsx`
    - Redirecionar para `/login` quando `!isAuthenticated`
    - _Requirements: 4.3_

  - [x] 3.4 Conectar rotas e logout no Frontend_Web
    - Envolver as rotas internas com `ProtectedRoute` e adicionar a rota `/login` em `App.jsx`
    - Envolver a aplicação com `AuthProvider`
    - Adicionar botão de logout no `Header`/`Sidebar` que chama `logout()` e redireciona para `/login`
    - _Requirements: 4.2, 4.3, 4.4_

  - [x]* 3.5 Escrever testes de UI do fluxo de login (Vitest + React Testing Library)
    - Acesso a rota interna sem login redireciona para `/login`; após `login()`, acessa a rota
    - `logout()` retorna à tela de login
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 4. Implementar fallback de dados mock no `cardioService`
  - [x] 4.1 Adicionar estratégia try/backend → catch/mock em `frontend/src/services/cardioService.js`
    - Para cada chamada (`getDashboardSummary`, `getPatients`, `getPatientById`, `getMonitoringSummary`/vitals, `risk`, `sendChatMessage`), retornar os mocks de `src/data/` em caso de erro
    - Manter `/images/analyze` e `/chat` consumindo o backend público
    - _Requirements: 1.6, 2.5_

  - [x]* 4.2 Escrever teste de exemplo para o fallback
    - Com a camada `api` forçando erro, `cardioService` retorna dados mock e a página renderiza sem `ErrorState`
    - _Requirements: 1.6_

- [x] 5. Criar configuração de deploy do Frontend_Web
  - [x] 5.1 Criar `frontend/vercel.json`
    - Rewrite SPA: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
    - _Requirements: 1.3, 1.4_

  - [x] 5.2 Documentar `VITE_API_URL` em `frontend/.env.example`
    - Adicionar `VITE_API_URL` apontando para a URL pública do Backend_CardioIA no Render
    - _Requirements: 1.5_

- [x] 6. Implementar o App_Mobile (Expo WebView)
  - [x] 6.1 Criar `mobile/App.js`
    - Tela única com `react-native-webview` carregando a URL pública do Frontend_Web na Vercel
    - Incluir `mobile/package.json` com as dependências Expo necessárias
    - _Requirements: 3.1, 3.5_

  - [x] 6.2 Criar `mobile/app.json`
    - Definir `expo.android.package` em formato de domínio invertido (ex.: `br.com.fiap.cardioia`)
    - _Requirements: 3.2_

  - [x] 6.3 Criar `mobile/eas.json`
    - Perfil `preview` com `android.buildType = "apk"`
    - _Requirements: 3.3, 3.4_

- [x] 7. Checkpoint — Garantir que build do frontend e testes passam
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implementar o Dispositivo_IoT no Wokwi
  - [x] 8.1 Criar `iot/main.py` (MicroPython)
    - Loop de leitura simulada de sinais vitais (FC, SpO2, PA sistólica) a partir de um sensor
    - Análise local classificando leitura como normal/alterada (ex.: `spo2 < 92`, `heart_rate > 110`)
    - Feedback visual (LED/OLED) quando fora da faixa
    - Envio `urequests.post(f"{API_URL}/iot/vitals", json=payload)` com payload compatível com `IoTVitalIn`
    - Capturar exceção de rede, registrar e seguir para o próximo ciclo
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 8.2 Criar `iot/diagram.json`
    - Definir o circuito Wokwi (sensor, LED/OLED, placa) compatível com `iot/main.py`
    - _Requirements: 6.5_

- [x] 9. Reforçar a segurança da Chave_OpenAI
  - [x] 9.1 Garantir exclusão de credenciais do versionamento
    - Incluir `.env` (e `frontend/.env`, `backend/.env`) no `.gitignore`
    - Remover qualquer valor de `OPENAI_API_KEY` de arquivos versionados; manter apenas placeholders em `*.env.example`
    - Confirmar que a chave é consumida apenas pelo Backend_CardioIA, nunca pelo Frontend_Web
    - _Requirements: 11.1, 11.3_

- [x] 10. Produzir o diagrama e os entregáveis de documentação
  - [x] 10.1 Criar o Diagrama_Arquitetura (Mermaid)
    - Fluxo Sensor → MicroPython → Backend Python → APIs de IA → UI
    - Identificar XGBoost, LLM OpenAI e TensorFlow na camada de IA; Frontend_Web e App_Mobile como UI
    - Salvar como artefato reutilizável (ex.: `docs/diagrama-arquitetura.md`)
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 10.2 Escrever o README da Fase 7 (`README.md`)
    - Descrever a Plataforma_CardioIA no contexto da Fase 7, substituindo conteúdo da Fase 6
    - Incluir URL da Vercel, link/QR do APK, Diagrama_Arquitetura, prints dos deploys, instruções de execução local (backend, frontend, mobile) e link do Wokwi
    - _Requirements: 7.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [x] 10.3 Escrever a fonte do Relatorio_Tecnico (`docs/relatorio-tecnico.md`)
    - Conteúdo para no máximo 5 páginas: Diagrama_Arquitetura, fluxo de dados (IoT → Backend → IA → UI) e integrantes do Grupo 30
    - _Requirements: 7.4, 9.1, 9.2, 9.3, 9.4_

  - [x] 10.4 Escrever o Roteiro_Video (`docs/roteiro-video.md`)
    - Demonstração fim a fim ≤ 5 min cobrindo Login_Mock, navegação, chat LLM, predição de risco, análise de imagem, envio IoT e App_Mobile carregando o Frontend_Web
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 11. Checkpoint final — Garantir que todos os testes passam e os artefatos estão completos
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tarefas marcadas com `*` são opcionais (testes) e podem ser puladas para um MVP mais rápido.
- Cada tarefa referencia critérios de aceitação específicos para rastreabilidade com a rubrica.
- Conforme o design, não há tarefas de Property-Based Testing; os testes são de smoke, integração e exemplo/UI.
- Ações manuais (deploy na Vercel/Render, execução do EAS Build, geração do PDF a partir da fonte Markdown, revogação da chave exposta e configuração da variável de ambiente no Render — R11.2, R11.4 — gravação do vídeo) não são tarefas de código e devem ser executadas pelo Grupo 30 usando os artefatos produzidos.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "3.1", "4.1", "5.1", "5.2", "6.1", "6.2", "6.3", "8.1", "8.2", "9.1", "10.1"] },
    { "id": 1, "tasks": ["1.2", "3.2", "3.3", "4.2", "10.2", "10.3", "10.4"] },
    { "id": 2, "tasks": ["1.3", "3.4"] },
    { "id": 3, "tasks": ["3.5"] }
  ]
}
```
