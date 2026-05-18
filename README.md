# FIAP - Faculdade de Informática e Administração Paulista

<p align="center">
<a href= "https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP - Faculdade de Informática e Admnistração Paulista" border="0" width=40% height=40%></a>
</p>

<br>

# 🏥 CardioIA - Sistema Preditivo Cardiológico com Arquitetura Multiagente

**Fase 6 - Capítulo 1: Implementação de Pipeline ML e Orquestração de Agentes**

## Descrição do Projeto

CardioIA é um sistema inteligente de triagem cardiológica que combina **Machine Learning avançado** com **arquitetura de múltiplos agentes**. O sistema analisa dados clínicos de pacientes, prediz o risco de condições cardíacas críticas e recomenda protocolos médicos automaticamente.

### Objetivos Alcançados

✅ **Pipeline de Dados e Machine Learning**: Modelo XGBoost treinado com 5.000 registros sintéticos, feature engineering avançado e validação cruzada  
✅ **Arquitetura Multiagente**: Três agentes especializados com handoff automático (Orquestrador → Analista de Risco → Especialista em Protocolos)  
✅ **Infraestrutura Robusta**: Ambiente isolado com dependências versionadas e configuração automática do VS Code

---
## Grupo 30

## 👨‍🎓 Integrantes

- [Ana Beatriz Duarte Domingues](https://www.linkedin.com/in/)
- [Junior Rodrigues da Silva](https://www.linkedin.com/in/jrsilva051/)
- [Carlos Emilio Castillo Estrada](https://www.linkedin.com/in/)

## 👩‍🏫 Professores:
### Tutor(a) 
- [Lucas Gomes Moreira](https://www.linkedin.com/company/inova-fusca)
### Coordenador(a)
- [André Godoi Chiovato](https://www.linkedin.com/company/inova-fusca)

---

## 📊 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                   PACIENTE (Dados Clínicos)                 │
│  idade, bpm, spo2, pressao_sistolica, carga_sistema, ...   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │  ORQUESTRADOR             │
         │  Coordena a triagem       │
         └────────────┬─────────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │  ANALISTA DE RISCO                 │
    │  • Executa modelo XGBoost          │
    │  • Calcula probabilidade de risco  │
    │  • Feature engineering em tempo    │
    │    real (indice_gravidade, ...)    │
    └────────────────┬───────────────────┘
                     │
                     ▼
   ┌──────────────────────────────────────┐
   │  ESPECIALISTA EM PROTOCOLOS          │
   │  • Classifica risco (EMERGÊNCIA/     │
   │    ALERTA/MONITORAMENTO)             │
   │  • Recomenda protocolo médico        │
   │  • Gera instruções para o corpo      │
   │    clínico                           │
   └──────────────────────────────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │   Recomendação Médica    │
        │   (com protocolo)        │
        └──────────────────────────┘
```

---

## 🚀 Início Rápido

### 1️⃣ Ativar o Ambiente Conda Isolado

O projeto utiliza um ambiente isolado `cardioia` para evitar conflitos de dependências:

```bash
conda activate cardioia
```

Se ainda não criou o ambiente, execute:

```bash
conda create -y -n cardioia python=3.11 numpy=1.26.4 pandas=2.2.2 scikit-learn=1.5.2 xgboost=2.1.1 joblib=1.4.2
conda activate cardioia
pip install -r requirements.txt
```

### 2️⃣ Treinar o Modelo ML

Executa o pipeline completo de treinamento:

```bash
python train_model.py
```

**Saída esperada:**
```
Comparativo de modelos (cross-validation):
             modelo  f1_mean  auc_mean
            XGBoost 0.499510  0.513647
      Random Forest 0.483036  0.500223
Logistic Regression 0.470903  0.515656

Modelo vencedor: XGBoost
Arquivos salvos: modelo_cardio_best.pkl, scaler.pkl
```

**O que acontece:**
- Gera 5.000 registros sintéticos de pacientes cardíacos
- Aplica feature engineering: indice_gravidade (bpm/spo2), pressao_pulso, carga_por_tempo
- Cria variáveis dummy para categorias (faixa_idade, faixa_spo2)
- Treina 3 modelos: Logistic Regression, Random Forest, XGBoost
- Valida com 5-fold cross-validation usando F1-Score e AUC-ROC
- Seleciona o melhor modelo (XGBoost) e persiste como `modelo_cardio_best.pkl`
- Salva o StandardScaler como `scaler.pkl`

### 3️⃣ Executar o Sistema Multiagente

Inicia a triagem cardiológica com orquestração automática de agentes:

```bash
python main.py
```

**Saída esperada:**
```
============================================================
  🏥 SISTEMA PREDITIVO CARDIOIA (ARQUITETURA MULTIAGENTE)
============================================================

📥 [ENTRADA] Novo paciente deu entrada na triagem

🏥 [ORQUESTRADOR] Recebendo dados do paciente...
   Dados do paciente: {'idade': 65, 'bpm': 110, ...}

📋 [ORQUESTRADOR] Transferindo para Analista de Risco...

🔬 [ANALISTA DE RISCO] Iniciando análise com modelo...
   ✅ Modelo XGBoost executado com sucesso
   📊 Probabilidade de risco: 52.44%

👨‍⚕️ [ANALISTA DE RISCO] Transferindo para Especialista...

📋 [ESPECIALISTA EM PROTOCOLOS] Definindo protocolo...

┌────────────────────────────────────────────────┐
│     RESULTADO DA TRIAGEM CARDIOLÓGICA           │
├────────────────────────────────────────────────┤
│ Probabilidade de Risco:        52.44%
│ Classificação:                 ⚠️  ALERTA
│
│ RECOMENDAÇÕES:
│  • Realizar exames detalhados
│  • Manter observação próxima (6-12h)
│  • Monitoramento de sinais vitais a cada 2h
│  • Eletrocardiograma e enzimas cardíacas
│  • Cardiologista deve avaliar nas próximas 4h
│  • Medicação preventiva conforme protocolo
└────────────────────────────────────────────────┘
```

---

## 📁 Estrutura do Projeto

```
Fase6_Cap1_Sistema_Preditivo-_IA/
├── train_model.py              # Pipeline ML: geração dados, feature eng., treinamento
├── agents_logic.py             # Lógica dos 3 agentes com handoff automático
├── main.py                     # Entry point: inicia triagem multiagente
├── inspect_model.py            # Utilitário: inspeciona estrutura do modelo
├── requirements.txt            # Dependências do projeto (com versões pinadas)
├── README.md                   # Este arquivo
├── modelo_cardio_best.pkl      # Modelo XGBoost treinado (gerado)
├── scaler.pkl                  # StandardScaler (gerado)
├── .vscode/
│   └── settings.json           # Configuração do VS Code (local)
├── .env.example                # Template de variáveis de ambiente
├── .env                        # Arquivo de configuração (não versionado)
├── .gitignore                  # Regras de exclusão Git
├── docs/
│   ├── Relatório Técnico.pdf              # Análise e decisões do modelo ML
│   └── Documentação de Arquitetura.pdf    # Diagrama da arquitetura multiagente
├── notebooks/
│   ├── CardioIA_EDA_Training.ipynb              # Notebook principal com EDA, treinamento e simulação
│   └── CardioIA_EDA_Training.executed.ipynb     # Versão executada com outputs e gráficos
├── assets/
│   └── logo-fiap.png           # Logo FIAP
└── .git/                       # Repositório Git local
```

---

## 🤖 Detalhes Técnicos

### Pipeline ML (`train_model.py`)

**Geração de Dados:**
- 5.000 registros sintéticos com características realísticas
- Features: idade, BPM, SpO2, pressão sistólica, carga do sistema, tempo de sintomas

**Feature Engineering:**
- `indice_gravidade` = BPM / SpO2 (indica severidade relativa)
- `pressao_pulso` = pressão_sistolica - 60 (proxy de rigidez arterial)
- `carga_por_tempo` = carga_sistema / (tempo_sintomas + 1) (progressão de severidade)
- **Variáveis Dummy:** faixa_idade (jovem/adulto/idoso), faixa_spo2 (baixa/media/alta)
- **Normalização:** StandardScaler (μ=0, σ=1)

**Modelos Treinados:**
1. **Logistic Regression** (baseline linear)
2. **Random Forest** (ensemble bagging com 300 trees)
3. **XGBoost** (gradient boosting com 300 estimadores, max_depth=4)

**Validação:**
- StratifiedKFold com 5 folds
- Métricas: F1-Score (para desequilíbrio de classes) e AUC-ROC
- Seleção automática do modelo com melhor F1-Score

### Arquitetura Multiagente (`agents_logic.py` + `main.py`)

**Fluxo de Agentes (com handoff automático):**

1. **Orquestrador**
   - Recebe dados brutos do paciente
   - Transfere para Analista de Risco

2. **Analista de Risco**
   - Aplica feature engineering em tempo real
   - Carrega modelo treinado e scaler persistidos
   - Executa predição XGBoost
   - Retorna probabilidade de risco (0-100%)
   - Transfere para Especialista em Protocolos

3. **Especialista em Protocolos**
   - Recebe probabilidade de risco
   - Classifica em 3 níveis:
     - **Emergência** (risco > 80%): Intervenção imediata, UTI preventiva
     - **Alerta** (50% ≤ risco ≤ 80%): Exames detalhados, observação 6-12h
     - **Monitoramento** (risco < 50%): Acompanhamento ambulatorial
   - Gera recomendações médicas específicas por nível

---

## 🛠️ Dependências

| Pacote | Versão | Propósito |
|--------|--------|----------|
| **NumPy** | 1.26.4 | Computação numérica (pinado <2.0 para compatibilidade binária) |
| **pandas** | 2.2.2 | Manipulação de dados |
| **scikit-learn** | 1.5.2 | Modelos ML, scaler, cross-validation |
| **XGBoost** | 2.1.1 | Gradient boosting |
| **joblib** | 1.4.2 | Persistência de modelos |
| **Python** | 3.11 | Runtime |

**Instalação das dependências:**
```bash
pip install -r requirements.txt
```

---

## 📊 Exemplo de Uso Customizado

Para testar com dados diferentes, edite o dicionário `paciente_dados` em `main.py`:

```python
paciente_dados = {
    "idade": 75,           # 18-90
    "bpm": 125,            # 50-140
    "spo2": 88,            # 85-100
    "pressao_sistolica": 170,  # 90-180
    "carga_sistema": 9.2,  # 0-10
    "tempo_sintomas": 24   # 0-72 horas
}
```

Execute: `python main.py`

---

## 📝 Notas Importantes

- **Dados Sintéticos**: O dataset é gerado sinteticamente para fins educacionais
- **Modelos**: Treinados apenas com dados sintéticos - não são para uso clínico real
- **Ambiente Isolado**: O ambiente `cardioia` evita conflitos com outras dependências do sistema
- **Predição em Tempo Real**: A feature engineering é feita em tempo de predição, permitindo integração com dados reais

---


## 🔍 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'sklearn'"
```bash
conda activate cardioia
pip install -r requirements.txt
```

### Erro: "Feature shape mismatch"
Certifique-se que os dados do paciente contêm exatamente os 6 campos necessários:
`idade, bpm, spo2, pressao_sistolica, carga_sistema, tempo_sintomas`

### Modelo não é carregado
Verifique se `modelo_cardio_best.pkl` e `scaler.pkl` existem na pasta raiz:
```bash
ls *.pkl
```

Se faltarem, execute: `python train_model.py`

---

## 🎬 Vídeo de Demonstração

**Vídeo do sistema completo em funcionamento (até 3 minutos):**
- 📹 [CardioIA - Demonstração do Sistema Multiagente](https://youtu.be/AqBF0_Uu-BM)

O vídeo demonstra:
- Entrada de dados do paciente crítico
- Fluxo completo do orquestrador
- Acionamento dos agentes especializados
- Geração da recomendação final estruturada

---

## 📦 Repositório GitHub

**Acesso ao código-fonte completo:**
- 🔗 [CardioIA GitHub Repository](https://github.com/Jr-RS/Fase6_Cap1_Sistema_Preditivo-_IA.git)

O repositório contém:
- Código-fonte completo (train_model.py, agents_logic.py, main.py)
- Notebook Jupyter com EDA e pipeline ML (notebooks/CardioIA_EDA_Training.ipynb)
- Documentação técnica em `/docs`
- Arquivo `.env.example` para configuração de chaves de API


---

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>


