# promptify

Optimizador de prompts para Claude. Mejorá prompts existentes o generá nuevos desde cero usando la API de Anthropic.

## Features

- **Mejorar prompt** — pegás tu prompt y lo optimiza automáticamente
- **Generar desde cero** — describís tu objetivo y genera el prompt ideal
- **Preguntas clarificadoras** — modo interactivo donde hace preguntas antes de generar
- **Comparación** — vista side-by-side del original vs mejorado
- **Historial** — guarda todos los prompts en localStorage

## Setup

### 1. Clonar e instalar

```bash
git clone https://github.com/TU_USUARIO/promptify.git
cd promptify
npm install
```

### 2. Correr en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador.

### 3. API Key

Al abrir la app te va a pedir tu API key de Anthropic. La podés obtener en:
https://console.anthropic.com/settings/keys

La key se guarda en localStorage — nunca sale de tu navegador.

## Build para producción

```bash
npm run build
npm run preview
```

## Stack

- React 18 + Vite
- CSS Modules
- Anthropic API (claude-sonnet-4-20250514)

## Estructura

```
src/
  components/     → UI components
  hooks/          → useHistory, useApiKey
  services/       → claude.js (API calls)
  styles/         → global CSS
```
