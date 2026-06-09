# Prints Necessários para o README (R8.5)

Tire screenshots das telas abaixo e salve nesta pasta com os nomes indicados.
O README.md já está configurado para referenciar esses arquivos.

## Lista de prints

1. **deploy-vercel.png**
   - Tela: Dashboard do projeto na Vercel mostrando status "Ready" (verde)
   - URL do print: painel da Vercel → seu projeto → aba "Deployments" → último deploy com status verde

2. **deploy-render.png**
   - Tela: Painel do serviço no Render mostrando status "Live" (verde)
   - URL do print: dashboard.render.com → cardioia-backend → topo com o selo "Live"
   - Você já tem essa imagem (a mesma que me mostrou antes)

3. **qrcode-apk.png** (quando o build EAS terminar)
   - Tela: QR Code do APK gerado pelo EAS Build
   - URL do print: expo.dev → cardioia → Builds → último build → aba "Install" mostra o QR

## Como salvar

Salve cada arquivo nesta pasta (`docs/prints/`) e depois descomente as linhas no README.md
(trocar os `<!-- -->` por imagens reais):

```markdown
![Deploy Vercel](docs/prints/deploy-vercel.png)
![Deploy Render](docs/prints/deploy-render.png)
![QR Code do APK](docs/prints/qrcode-apk.png)
```
