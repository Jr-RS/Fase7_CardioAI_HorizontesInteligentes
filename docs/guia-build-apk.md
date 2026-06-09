# Guia — Gerar o APK do App_Mobile (EAS Build)

Passo a passo para gerar o APK do CardioIA e obter o link/QR Code para o vídeo e o README.

> O build roda na **nuvem do Expo** — você NÃO precisa do `npm install` local funcionando.
> Só precisa do EAS CLI e de uma conta Expo gratuita.

## Pré-requisito
- Conta gratuita no Expo: https://expo.dev (pode entrar com GitHub ou Google).

---

## Passo 1 — Abrir o terminal na pasta `mobile`

```powershell
cd "c:\Users\JuniorRodriguesdaSil\OneDrive - Ibratan Ilimitada\Documentos\pessoal\fiap\git\Fase7_CardioAI_HorizontesInteligentes\mobile"
```

## Passo 2 — Instalar o EAS CLI (global)

```powershell
npm install -g eas-cli
```

Confirme a instalação:

```powershell
eas --version
```

## Passo 3 — Fazer login na conta Expo

```powershell
eas login
```

Digite o e-mail/usuário e a senha da sua conta Expo.

## Passo 4 — Inicializar o projeto EAS (gera o projectId)

```powershell
eas init
```

- Pergunta: **"Would you like to create a project for @seu-usuario/cardioia?"** → responda **Y**.
- Isso adiciona automaticamente o `extra.eas.projectId` e o `owner` no `app.json`.

## Passo 5 — Disparar o build do APK

```powershell
eas build -p android --profile preview
```

Durante o processo, responda:
- **"Generate a new Android Keystore?"** → **Y** (deixa o Expo gerar e guardar a assinatura).
- O upload do código e o build na nuvem levam ~10 a 15 minutos.

## Passo 6 — Obter o APK e o QR Code

Ao terminar, o terminal mostra:
- Um **link** do artefato (ex.: `https://expo.dev/artifacts/eas/xxxxx.apk`)
- Um **QR Code** direto no terminal.

Você também encontra o build e o QR Code em:
**https://expo.dev** → seu projeto **cardioia** → aba **Builds** → último build.

---

## O que fazer com o link/QR

1. **No vídeo:** mostre o QR Code da página do build no Expo (o avaliador escaneia e instala).
2. **No README:** me envie o link do APK que eu atualizo a seção "Acessos Rápidos" e adiciono o QR Code.

---

## Se algo der errado

| Erro | Solução |
|---|---|
| `eas: command not found` | Reabra o terminal após o `npm install -g eas-cli`. |
| Build falha por dependências | O `package.json` e `babel.config.js` já estão corrigidos; rode `eas build` de novo. |
| Pede `projectId` | Rode `eas init` antes do build (Passo 4). |
| Login não abre | Tente `eas login --help`; ou crie a conta primeiro em https://expo.dev. |

---

## Commit final (depois do build)

O `eas init` altera o `app.json` (adiciona projectId/owner). Para versionar:

```powershell
cd "c:\Users\JuniorRodriguesdaSil\OneDrive - Ibratan Ilimitada\Documentos\pessoal\fiap\git\Fase7_CardioAI_HorizontesInteligentes"
git add mobile/app.json
git commit -m "chore(mobile): adiciona projectId do EAS"
git push origin main
```
