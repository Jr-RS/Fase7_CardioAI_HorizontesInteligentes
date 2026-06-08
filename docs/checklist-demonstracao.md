# Checklist de Teste e Demonstração — CardioIA (Fase 7)

Guia prático para validar a plataforma de ponta a ponta e gravar o vídeo. Cada item indica
**onde clicar**, **o que mostrar** e **o resultado esperado**. A ordem segue o fluxo do vídeo.

## Pré-condições (antes de começar)

- [ ] Backend e frontend no ar (`docker compose up`), ou as URLs públicas (Vercel/Render) ativas.
- [ ] Chave `GEMINI_API_KEY` configurada no `backend/.env` (chat real).
- [ ] Fazer **Ctrl+Shift+R** no navegador para descartar cache antigo.
- [ ] Verificar a saúde do backend: abrir `http://localhost:8000/health` → `{"status":"ok"}`.

---

## 1. Login (Login_Mock) — R4

- [ ] Abrir a aplicação (`http://localhost:5173`).
- [ ] Tentar acessar uma rota interna direto (ex.: `/patients`) **sem login** → deve redirecionar para `/login`.
- [ ] Preencher usuário e senha (qualquer valor com os campos preenchidos) e clicar **Entrar**.
- [ ] **Esperado:** acesso liberado, redireciona para o Dashboard.

## 2. Dashboard — navegação geral

- [ ] Mostrar o resumo de pacientes (total, críticos, moderados).
- [ ] Apontar o menu lateral: Dashboard, Pacientes, Monitoreo, Imágenes, Chat IA, Arquitectura.

## 3. Pacientes (dados + detalhe) — R5.1

- [ ] Abrir **Pacientes** → mostrar a lista (5 pacientes).
- [ ] Clicar em um paciente (ex.: João Silva) → abrir o detalhe.
- [ ] **Esperado:** dados do paciente, sinais vitais e cartão de risco.

## 4. Predição de risco (XGBoost) — R5.3

- [ ] No detalhe do paciente, destacar o **nível de risco** (alto/moderado/baixo), o score e o motivo.
- [ ] **Esperado:** valor calculado pelo modelo XGBoost real (ex.: João Silva → moderado, score 65).

## 5. Monitoreo — R5.1

- [ ] Abrir **Monitoreo** → mostrar as médias (FC, SpO2, PA) e as últimas leituras.

## 6. Chat IA (Google Gemini) — R5.2 / R5.5

- [ ] Abrir **Chat IA**.
- [ ] **Pergunta dentro do escopo:** "Resuma o caso do paciente João Silva".
  - **Esperado:** resposta em texto limpo com dados do paciente + histórico de vitais + risco.
- [ ] **Pergunta fora de escopo:** "Me prescreva a dosagem de medicamento para o paciente 1".
  - **Esperado:** recusa — "Não tenho dados nem autorização para responder esse tipo de solicitação...".
- [ ] (Opcional) Perguntar por paciente inexistente → resposta informa que não foi localizado na base.

## 7. Análise de imagem (TensorFlow) — R5.4

- [ ] Abrir **Imágenes**.
- [ ] Selecionar a radiografia (`assets/radiografia.jpg`).
- [ ] **Esperado:** preview da imagem aparece na tela.
- [ ] Clicar **Analizar**.
- [ ] **Esperado:** resultado com rótulo (ex.: "Possível Cardiomegalia") e probabilidade (~90%), exibido ao lado da imagem.

## 8. Dispositivo IoT (Wokwi) — R6

- [ ] Abrir **Arquitectura** → mostrar o diagrama do fluxo e o **simulador Wokwi incorporado** (iframe).
- [ ] Iniciar a simulação no Wokwi (botão ▶) → mostrar a leitura dos sinais vitais e o LED de alerta quando fora da faixa.
- [ ] (Opcional) Mostrar o log do `POST /iot/vitals` enviando dados ao backend.
- [ ] Link direto do projeto: https://wokwi.com/projects/464629362761551873

## 9. App Mobile (Expo WebView) — R3

- [ ] Abrir o APK no Android (ou Expo Go).
- [ ] **Esperado:** o app carrega o mesmo Frontend_Web (da Vercel) dentro da WebView.
- [ ] Navegar por uma ou duas telas para mostrar a paridade com a versão web.

## 10. Logout — R4.4

- [ ] Clicar em **Sair** no cabeçalho → retorna à tela de login.

---

## Resumo dos motores de IA demonstrados

| Funcionalidade | Motor | Endpoint | Evidência esperada |
|---|---|---|---|
| Predição de risco | XGBoost | `GET /risk/{id}` | nível + score + motivo |
| Chat assistivo | Google Gemini | `POST /chat` | resposta contextual + recusa fora de escopo |
| Análise de imagem | TensorFlow | `POST /images/analyze` | label + probabilidade |
| Ingestão de sinais vitais | — | `POST /iot/vitals` | registro adicionado |

## Dicas para a gravação

- Aqueça o backend (acesse `/health`) antes de gravar para evitar latência de cold start.
- Se o backend cair, o frontend usa dados mock de fallback — útil para não travar a demo, mas avise que é fallback.
- Mantenha o ritmo: o vídeo tem teto de 5 minutos (ver `docs/roteiro-video.md`).
- Nunca exiba a `GEMINI_API_KEY` na tela (terminal, .env ou código).
