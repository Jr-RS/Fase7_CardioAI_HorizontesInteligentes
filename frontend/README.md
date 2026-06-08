## Environment Setup

Copy `frontend/.env.example` to `frontend/.env` and fill in the values before starting the app.

Required values:
- `VITE_API_URL`: backend URL, usually `http://127.0.0.1:8000`

The Chave_Gemini (`GEMINI_API_KEY`) is used **exclusively by the Backend_CardioIA** (R11.1). Never set it in the Frontend_Web; the React app only talks to the backend via `VITE_API_URL`.

Do not commit `frontend/.env` to git. Keep secrets in your local environment or a secret manager.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
