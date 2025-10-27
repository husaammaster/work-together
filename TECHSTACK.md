## Tech Stack

- Backend: Node.js (ES modules), Express
- Database: CouchDB (client: `nano`)
- Realtime: WebSocket (`ws`)
- Dev tooling: nodemon, Docker, Docker Compose

### Repository layout

- `server/` backend (Express API, WS)
- `public/` static frontend assets (legacy)
- `react_app/` new React (Vite) frontend (in development)
- `Dockerfile` Node image for backend service
- `compose.yaml` multi-service dev (web + couchdb)

### Development workflow

- File sync via Docker Compose develop.watch
  - Start in watch mode: `docker compose up --watch`
  - `services.backend.develop.watch` syncs project files to `/app` and rebuilds on `package*.json` changes.
  - Backend restarts via nodemon on changes under `server/`.
  - Frontend changes under `public/` are served on browser refresh (no server restart required).

### Nodemon

- Script: `npm run dev` → `nodemon server/backend.js`
- Config (`nodemon.json`): watches `server/`, ignores `public/**` and `node_modules/**`, uses polling (`legacyWatch: true`) for reliability in Docker.

### Containers / services

- `backend`: Node backend (exposes port 80), runs `npm run dev` (overrides image CMD at runtime).
- `couchdb`: Apache CouchDB (exposes 5984) with healthcheck.

Notes:

- `develop.watch` rules are active only when starting with `docker compose up --watch` (or `docker compose watch`).
- React app runs locally (`npm run dev` in `react_app/`) and fetches from backend via CORS.

### Frontend architecture

- **Legacy**: Static HTML/JS in `public/`, served by Express.
- **New**: React (Vite) SPA in `react_app/`, decoupled API-driven frontend.
  - Framework: React with Vite for build tooling.
  - Styling: Tailwind CSS for responsive dark-mode UI.
  - State Management: Redux Toolkit for global state (user management, future expansions).
  - Routing: React Router for SPA navigation.
  - Runs locally on `localhost:5173`.
  - Fetches from backend at `http://localhost:80` (configured via `.env.development`).
  - CORS configured in backend to allow `localhost:5173`.
  - Current: Project list with fetch from `/projects` endpoint.
  - Next: Merge full CRUD (create/edit projects, helpers, comments), add routing with React Router, basic Redux setup for user state.

### CORS

- Backend configured with manual CORS middleware to allow React app origin `http://localhost:5173` for GET/POST/OPTIONS.
