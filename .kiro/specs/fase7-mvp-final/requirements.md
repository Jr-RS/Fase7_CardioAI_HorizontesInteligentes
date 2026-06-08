# Documento de Requisitos

## Introdução

Esta especificação define os requisitos para a finalização e entrega do MVP da plataforma **CardioIA — Fase 7 (Horizontes Inteligentes)**, projeto acadêmico da FIAP desenvolvido pelo Grupo 30 (3 integrantes). O objetivo é integrar os módulos das fases anteriores (backend FastAPI com IA preditiva, LLM e análise de imagem; frontend React; IoT MicroPython), publicá-los em ambientes profissionais (Vercel e Render), disponibilizar um aplicativo móvel (APK via Expo/EAS) e produzir a documentação e entregáveis exigidos pela rubrica de avaliação (10 pontos).

O escopo está **estritamente limitado** às lacunas de entrega descritas abaixo. Nenhuma funcionalidade nova de domínio (novos endpoints, novos motores de IA, novas telas) deve ser adicionada além do necessário para fechar os critérios da rubrica. A prioridade é um MVP básico bem-feito, com foco em rastreabilidade entre cada critério da rubrica e os requisitos desta especificação.

### Mapa de Rastreabilidade da Rubrica

| Critério da Rubrica | Pontos | Requisitos Relacionados |
|---|---|---|
| URLs funcionais (Vercel) e build mobile (.apk via EAS) acessíveis | 3.0 | R1, R2, R3 |
| Unificação funcional do backend com interfaces e motores de IA | 2.5 | R4, R5 |
| Conversão e funcionalidade correta da lógica de sensores no Wokwi | 1.5 | R6 |
| Clareza no diagrama final e fluidez na comunicação dos dados | 1.5 | R7 |
| Qualidade do README, do relatório PDF e clareza da demonstração | 1.5 | R8, R9, R10 |
| Grupo de 4-5 integrantes (extra) | 1.0 | Não aplicável (3 integrantes) |
| Segurança da chave de API (requisito transversal) | — | R11 |

## Glossary

- **Plataforma_CardioIA**: A solução completa composta por backend, frontend web, aplicativo móvel e dispositivo IoT.
- **Backend_CardioIA**: Serviço FastAPI existente (pasta `backend/`) que expõe os endpoints de dados, IA preditiva (XGBoost), LLM (OpenAI) e análise de imagem (TensorFlow).
- **Frontend_Web**: Aplicação React 19 + Vite (pasta `frontend/`) que consome o Backend_CardioIA via `cardioService.js`.
- **App_Mobile**: Aplicativo Android construído com Expo e `react-native-webview` que carrega a URL pública do Frontend_Web.
- **Dispositivo_IoT**: Simulação MicroPython no Wokwi que lê sinais vitais, executa análise local e os envia ao Backend_CardioIA.
- **Vercel**: Plataforma de hospedagem do Frontend_Web com CI/CD por push.
- **Render**: Plataforma de hospedagem do Backend_CardioIA usando o Dockerfile existente (free tier).
- **EAS_Build**: Serviço Expo Application Services usado para gerar o APK do App_Mobile no perfil `preview`.
- **Login_Mock**: Fluxo de autenticação simulado, implementado apenas no Frontend_Web, sem backend de autenticação.
- **VITE_API_URL**: Variável de ambiente do Frontend_Web que define a URL base pública do Backend_CardioIA.
- **Diagrama_Arquitetura**: Diagrama final do fluxo Sensor → MicroPython → Backend Python → APIs de IA → UI.
- **Relatorio_Tecnico**: Documento PDF de no máximo 5 páginas descrevendo a solução, o diagrama e o fluxo de dados.
- **Roteiro_Video**: Plano/roteiro textual da demonstração em vídeo (gravação manual, fora do escopo automatizado).
- **Avaliador**: Tutor ou banca que avalia a entrega conforme a rubrica.
- **Chave_OpenAI**: Credencial de API da OpenAI usada exclusivamente pelo Backend_CardioIA.

## Requirements

### Requirement 1: Deploy do Frontend Web na Vercel

**User Story:** Como integrante do Grupo 30, quero publicar o Frontend_Web na Vercel com CI/CD e roteamento SPA, para que o Avaliador acesse a interface por uma URL pública estável.

#### Acceptance Criteria

1. THE Frontend_Web SHALL ser publicado na Vercel acessível por uma URL pública HTTPS.
2. WHEN um push é realizado para a branch de produção do repositório, THE Vercel SHALL iniciar automaticamente um novo build e deploy do Frontend_Web.
3. THE Frontend_Web SHALL incluir um arquivo `vercel.json` que redireciona todas as rotas não correspondentes a arquivos estáticos para `index.html`, suportando o roteamento SPA.
4. WHEN o Avaliador acessa diretamente uma rota interna da aplicação (por exemplo `/patients`), THE Vercel SHALL retornar a aplicação React com o HTTP status 200.
5. THE Frontend_Web SHALL utilizar a variável `VITE_API_URL` configurada com a URL pública do Backend_CardioIA hospedado no Render.
6. WHEN o Backend_CardioIA está indisponível, THE Frontend_Web SHALL exibir os dados mock de fallback presentes em `src/data/`.

### Requirement 2: Deploy do Backend na Render

**User Story:** Como integrante do Grupo 30, quero publicar o Backend_CardioIA no Render usando o Dockerfile existente, para que o Frontend_Web, o App_Mobile e o Dispositivo_IoT consumam uma API pública.

#### Acceptance Criteria

1. THE Backend_CardioIA SHALL ser publicado no Render acessível por uma URL pública HTTPS.
2. THE Render SHALL construir o Backend_CardioIA a partir do Dockerfile existente em `backend/`.
3. WHEN o endpoint `/health` da URL pública é requisitado, THE Backend_CardioIA SHALL responder com HTTP status 200.
4. THE Backend_CardioIA SHALL manter a configuração de CORS que permite requisições originadas da URL pública do Frontend_Web na Vercel.
5. WHERE o Render utiliza o free tier, THE Backend_CardioIA SHALL responder corretamente às requisições após o período de inatividade (cold start), ainda que com latência adicional na primeira requisição.

### Requirement 3: Aplicativo Móvel via Expo e APK por EAS Build

**User Story:** Como integrante do Grupo 30, quero gerar um aplicativo Android que carrega o Frontend_Web em uma WebView, para que o Avaliador instale e use a plataforma em um dispositivo móvel.

#### Acceptance Criteria

1. THE App_Mobile SHALL ser implementado com Expo utilizando o componente `react-native-webview` que carrega a URL pública do Frontend_Web na Vercel.
2. THE App_Mobile SHALL incluir um arquivo `app.json` com o campo `android.package` definido em formato de domínio invertido.
3. THE App_Mobile SHALL incluir um arquivo `eas.json` contendo um perfil `preview` configurado para gerar um artefato APK.
4. WHEN o EAS_Build é executado com o perfil `preview`, THE EAS_Build SHALL produzir um arquivo APK instalável.
5. WHEN o APK é instalado e aberto em um dispositivo Android, THE App_Mobile SHALL exibir o Frontend_Web carregado a partir da URL pública da Vercel.
6. THE App_Mobile SHALL disponibilizar o APK por meio de um link ou QR Code de acesso para o Avaliador.

### Requirement 4: Login Mock no Frontend

**User Story:** Como usuário da Plataforma_CardioIA, quero realizar um login simples antes de acessar o conteúdo, para que o fluxo de autenticação exigido pela rubrica seja demonstrado.

#### Acceptance Criteria

1. THE Login_Mock SHALL ser implementado exclusivamente no Frontend_Web, sem dependência de backend de autenticação.
2. WHEN o usuário submete as credenciais no formulário de login, THE Login_Mock SHALL conceder acesso às páginas internas da aplicação.
3. WHILE o usuário não tiver realizado o Login_Mock, THE Frontend_Web SHALL exibir a tela de login ao tentar acessar páginas internas.
4. WHEN o usuário aciona a opção de sair (logout), THE Frontend_Web SHALL retornar o usuário à tela de login.

### Requirement 5: Unificação Funcional do Backend com Interfaces e Motores de IA

**User Story:** Como integrante do Grupo 30, quero que todas as interfaces consumam o Backend_CardioIA público integrando os motores de IA, para demonstrar a unificação funcional da plataforma.

#### Acceptance Criteria

1. WHEN o Frontend_Web requisita `/dashboard/summary`, `/patients`, `/patients/{id}`, `/vitals/{id}`, `/risk/{id}` ou `/monitoring/summary` da URL pública, THE Backend_CardioIA SHALL responder com os dados correspondentes e HTTP status 200.
2. WHEN o Frontend_Web envia uma mensagem ao endpoint `/chat`, THE Backend_CardioIA SHALL retornar uma resposta gerada pelo motor LLM da OpenAI.
3. WHEN o Frontend_Web requisita `/risk/{id}`, THE Backend_CardioIA SHALL retornar a predição de risco gerada pelo modelo XGBoost.
4. WHEN o Frontend_Web envia uma imagem ao endpoint `/images/analyze`, THE Backend_CardioIA SHALL retornar o resultado da análise produzida pelo motor TensorFlow.
5. IF a Chave_OpenAI for inválida ou o serviço da OpenAI estiver indisponível, THEN THE Backend_CardioIA SHALL retornar uma mensagem de erro descritiva ao endpoint `/chat`.

### Requirement 6: Lógica de Sensores IoT no Wokwi

**User Story:** Como integrante do Grupo 30, quero evoluir o Dispositivo_IoT no Wokwi com leitura de sensor, análise local e feedback visual, para demonstrar a integração ponta a ponta com o backend público.

#### Acceptance Criteria

1. THE Dispositivo_IoT SHALL realizar a leitura simulada de sinais vitais a partir de um sensor no ambiente Wokwi.
2. THE Dispositivo_IoT SHALL executar uma análise local dos sinais vitais lidos antes do envio.
3. WHEN a análise local classifica um sinal vital fora da faixa normal, THE Dispositivo_IoT SHALL acionar um feedback visual (LED ou OLED) indicando a condição.
4. WHEN um ciclo de leitura é concluído, THE Dispositivo_IoT SHALL enviar os sinais vitais ao endpoint `/iot/vitals` da URL pública do Backend_CardioIA via HTTP POST.
5. THE Dispositivo_IoT SHALL ser disponibilizado por meio de um link público do projeto Wokwi.

### Requirement 7: Diagrama de Arquitetura Final

**User Story:** Como Avaliador, quero visualizar um diagrama claro do fluxo de dados da plataforma, para compreender a comunicação entre os componentes.

#### Acceptance Criteria

1. THE Diagrama_Arquitetura SHALL representar o fluxo de dados na sequência Sensor → MicroPython → Backend Python → APIs de IA → UI.
2. THE Diagrama_Arquitetura SHALL identificar os motores de IA (XGBoost preditivo, LLM OpenAI e análise de imagem TensorFlow) como integrantes da camada de APIs de IA.
3. THE Diagrama_Arquitetura SHALL identificar o Frontend_Web e o App_Mobile como camadas de interface (UI).
4. THE Diagrama_Arquitetura SHALL ser incluído no README e no Relatorio_Tecnico.

### Requirement 8: README da Fase 7

**User Story:** Como Avaliador, quero um README atualizado para a Fase 7, para encontrar todos os artefatos e instruções da entrega.

#### Acceptance Criteria

1. THE README SHALL descrever a Plataforma_CardioIA no contexto da Fase 7 (Horizontes Inteligentes), substituindo o conteúdo referente à Fase 6.
2. THE README SHALL apresentar a URL pública do Frontend_Web na Vercel.
3. THE README SHALL apresentar o link e o QR Code de acesso ao APK gerado pelo EAS_Build.
4. THE README SHALL incluir o Diagrama_Arquitetura.
5. THE README SHALL incluir capturas de tela (prints) dos deploys na Vercel e no Render.
6. THE README SHALL incluir as instruções de instalação e execução local do Backend_CardioIA, do Frontend_Web e do App_Mobile.
7. THE README SHALL incluir o link público do projeto Wokwi do Dispositivo_IoT.

### Requirement 9: Relatório Técnico em PDF

**User Story:** Como Avaliador, quero um relatório técnico conciso em PDF, para avaliar a solução de forma estruturada.

#### Acceptance Criteria

1. THE Relatorio_Tecnico SHALL ser entregue em formato PDF com no máximo 5 páginas.
2. THE Relatorio_Tecnico SHALL incluir o Diagrama_Arquitetura.
3. THE Relatorio_Tecnico SHALL descrever o fluxo de dados entre o Dispositivo_IoT, o Backend_CardioIA, os motores de IA e as interfaces de usuário.
4. THE Relatorio_Tecnico SHALL identificar os integrantes do Grupo 30.

### Requirement 10: Roteiro do Vídeo Demonstrativo

**User Story:** Como integrante do Grupo 30, quero um roteiro do vídeo demonstrativo, para orientar a gravação do fluxo fim a fim dentro do tempo permitido.

#### Acceptance Criteria

1. THE Roteiro_Video SHALL descrever uma demonstração do fluxo fim a fim com duração planejada de no máximo 5 minutos.
2. THE Roteiro_Video SHALL incluir as etapas de Login_Mock, navegação no Frontend_Web, uso do chat com LLM, predição de risco, análise de imagem e envio de dados pelo Dispositivo_IoT.
3. THE Roteiro_Video SHALL indicar a demonstração do App_Mobile carregando o Frontend_Web.

### Requirement 11: Segurança da Chave de API

**User Story:** Como integrante do Grupo 30, quero proteger a Chave_OpenAI, para evitar a exposição de credenciais sensíveis no repositório.

#### Acceptance Criteria

1. THE Chave_OpenAI SHALL ser utilizada exclusivamente pelo Backend_CardioIA, nunca pelo Frontend_Web.
2. THE Chave_OpenAI exposta anteriormente no `frontend/.env` SHALL ser revogada.
3. THE arquivo `.gitignore` SHALL incluir os arquivos `.env` para impedir o versionamento de credenciais.
4. WHEN o Backend_CardioIA é executado no Render, THE Chave_OpenAI SHALL ser fornecida por meio de variável de ambiente do serviço, não versionada no repositório.
