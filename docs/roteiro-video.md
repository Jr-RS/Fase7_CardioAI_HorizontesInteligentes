# Roteiro do Vídeo Demonstrativo — CardioIA (Fase 7)

Artefato **Roteiro_Video** para orientar a gravação manual da demonstração fim a fim da
Plataforma_CardioIA. O roteiro foi planejado para uma duração total de **no máximo 5 minutos**
(R10.1) e cobre todas as etapas exigidas pela rubrica (R10.2, R10.3).

## Objetivo

Demonstrar, em fluxo contínuo, a unificação funcional da plataforma: do Login_Mock no
Frontend_Web, passando pela navegação, chat com LLM, predição de risco (XGBoost), análise de
imagem (TensorFlow) e envio de dados pelo Dispositivo_IoT (Wokwi), encerrando com o App_Mobile
carregando o Frontend_Web em uma WebView Android.

## Antes de gravar (checklist de preparação)

- [ ] Backend_CardioIA ativo no Render (acessar `/health` antes para evitar cold start durante a gravação).
- [ ] Frontend_Web publicado na Vercel e `VITE_API_URL` apontando para o Render.
- [ ] Projeto Wokwi do Dispositivo_IoT aberto e pronto para iniciar a simulação.
- [ ] APK instalado em um dispositivo/emulador Android (App_Mobile).
- [ ] Imagem de radiografia disponível (`assets/radiografia.jpg`) para a análise de imagem.
- [ ] Microfone testado; resolução de gravação em 1080p; abas/janelas organizadas para troca rápida.

## Distribuição do Tempo (total ≤ 5:00)

| Bloco | Janela de tempo | Duração | Etapa demonstrada | Requisito |
|---|---|---|---|---|
| 1 | 00:00 – 00:25 | 0:25 | Abertura e contexto | R10.1 |
| 2 | 00:25 – 00:55 | 0:30 | Login_Mock no Frontend_Web | R10.2 |
| 3 | 00:55 – 01:30 | 0:35 | Navegação no Frontend_Web (dashboard, pacientes, monitoramento) | R10.2 |
| 4 | 01:30 – 02:10 | 0:40 | Chat com LLM (Google Gemini) | R10.2 |
| 5 | 02:10 – 02:45 | 0:35 | Predição de risco (XGBoost) | R10.2 |
| 6 | 02:45 – 03:25 | 0:40 | Análise de imagem (TensorFlow) | R10.2 |
| 7 | 03:25 – 04:10 | 0:45 | Envio de dados pelo Dispositivo_IoT (Wokwi) | R10.2 |
| 8 | 04:10 – 04:45 | 0:35 | App_Mobile carregando o Frontend_Web | R10.3 |
| 9 | 04:45 – 05:00 | 0:15 | Encerramento | R10.1 |

> Tempo total planejado: **5:00**. Há folga de ~5–10 s por bloco; se algum endpoint demorar
> (cold start), corte trechos de navegação no bloco 3 para manter o teto de 5 minutos.

---

## Roteiro Detalhado

### Bloco 1 — Abertura e contexto (00:00 – 00:25)

- **Tela:** slide ou cabeçalho do README com o nome do projeto e logo FIAP.
- **Narração:** "Olá! Somos o Grupo 30. Este é o CardioIA, a entrega da Fase 7 — Horizontes
  Inteligentes. Vamos mostrar a plataforma completa: web na Vercel, backend com três motores de
  IA no Render, dispositivo IoT no Wokwi e o app Android. Tudo integrado."
- **Ação:** apresentar rapidamente o Diagrama_Arquitetura (fluxo Sensor → MicroPython →
  Backend Python → APIs de IA → UI).

### Bloco 2 — Login_Mock (00:25 – 00:55)

- **Tela:** URL pública da Vercel, tela de login.
- **Narração:** "O acesso começa pela tela de login. É um login demonstrativo, implementado só
  no frontend, sem backend de autenticação."
- **Ação:**
  1. Mostrar que ao tentar acessar uma rota interna sem login, a aplicação redireciona para `/login`.
  2. Preencher usuário e senha e submeter.
  3. Confirmar o acesso à área interna (dashboard).

### Bloco 3 — Navegação no Frontend_Web (00:55 – 01:30)

- **Tela:** dashboard e páginas internas.
- **Narração:** "Já autenticados, vemos o painel com o resumo de pacientes, a lista de
  pacientes e o monitoramento de sinais vitais — todos os dados vêm do backend público no Render."
- **Ação:**
  1. Mostrar o `/dashboard/summary` (total, críticos, moderados).
  2. Abrir a lista de pacientes (`/patients`) e selecionar um paciente.
  3. Mostrar os sinais vitais do paciente (`/vitals/{id}`) e o resumo de monitoramento.

### Bloco 4 — Chat com LLM (01:30 – 02:10)

- **Tela:** tela de chat assistivo.
- **Narração:** "Aqui está o assistente baseado no LLM do Google Gemini. A chave de API fica
  exclusivamente no backend, nunca no frontend. O assistente responde somente sobre pacientes
  cadastrados e recusa pedidos fora de escopo, como prescrições."
- **Ação:**
  1. Perguntar sobre um paciente cadastrado (ex.: "Resuma o caso do paciente João Silva").
  2. Mostrar a resposta com os dados e o risco calculado (`POST /chat`).
  3. (Opcional) Fazer um pedido fora de escopo (ex.: prescrição) e mostrar a recusa do assistente.

### Bloco 5 — Predição de risco (XGBoost) (02:10 – 02:45)

- **Tela:** detalhe do paciente com o cartão de risco.
- **Narração:** "A predição de risco usa o modelo XGBoost no backend. Ele retorna o score, o
  nível — alto, moderado ou baixo — e a justificativa."
- **Ação:**
  1. Acionar/visualizar a predição de risco do paciente (`GET /risk/{id}`).
  2. Destacar o nível retornado e a explicação.

### Bloco 6 — Análise de imagem (TensorFlow) (02:45 – 03:25)

- **Tela:** tela de análise de imagem.
- **Narração:** "Agora a análise de imagem, feita por um modelo TensorFlow. Vamos enviar uma
  radiografia."
- **Ação:**
  1. Selecionar a imagem (`assets/radiografia.jpg`) e enviar (`POST /images/analyze`).
  2. Mostrar o resultado retornado (`label` e `probability`).

### Bloco 7 — Envio de dados pelo Dispositivo_IoT (03:25 – 04:10)

- **Tela:** projeto Wokwi com o circuito (sensor + LED/OLED).
- **Narração:** "No Wokwi, o dispositivo MicroPython lê os sinais vitais, faz a análise local e,
  quando detecta um valor fora da faixa, aciona o feedback visual. A cada ciclo, envia os dados
  ao backend."
- **Ação:**
  1. Iniciar a simulação e mostrar a leitura dos sinais vitais.
  2. Demonstrar o LED/OLED acionado quando um valor sai da faixa normal (ex.: SpO2 < 92).
  3. Mostrar o log do `HTTP POST /iot/vitals` para a URL pública do Render.
  4. (Opcional) Voltar rapidamente ao Frontend_Web para evidenciar o dado recém-enviado.

### Bloco 8 — App_Mobile carregando o Frontend_Web (04:10 – 04:45)

- **Tela:** dispositivo/emulador Android com o APK instalado.
- **Narração:** "Por fim, o aplicativo Android, gerado via Expo/EAS Build. Ele carrega o mesmo
  Frontend_Web da Vercel dentro de uma WebView."
- **Ação:**
  1. Abrir o App_Mobile no Android.
  2. Mostrar a plataforma web carregada na WebView e navegar por uma ou duas telas.

### Bloco 9 — Encerramento (04:45 – 05:00)

- **Tela:** README/links da entrega (URL da Vercel, link/QR do APK, link do Wokwi).
- **Narração:** "Essa é a entrega integrada do CardioIA na Fase 7. Todos os links estão no
  README. Obrigado!"
- **Ação:** mostrar a página do build no Expo (https://expo.dev/accounts/jr-rs/projects/cardioia/builds/4e20f871-3824-4b81-a814-6d7977a107a6) com o botão "Install" e QR Code visível. Isso permite o avaliador escanear e instalar o APK.

---

## Pontos de atenção durante a gravação

- Verifique o `/health` do backend imediatamente antes de iniciar para evitar latência de cold
  start (Render free tier) durante a demonstração ao vivo.
- Caso o backend fique indisponível, o Frontend_Web exibe dados mock de fallback — isso mantém a
  fluidez da demonstração, mas mencione que se trata do fallback.
- Mantenha o ritmo: o teto é de 5 minutos. Se um bloco atrasar, reduza a navegação do Bloco 3.
- Não exiba a Chave_Gemini em nenhum momento (terminal, variáveis de ambiente ou código).
