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
- `react-build-launch`: React dev server (exposes port 5174), runs `npm run dev -- --host` for hot-reload.
- `couchdb`: Apache CouchDB (exposes 5984) with healthcheck.

Notes:

- `develop.watch` rules are active only when starting with `docker compose up --watch` (or `docker compose watch`).
- React app runs in Docker container with hot-reload via Vite dev server.
- Backend and React communicate via Docker Compose network (`backend` service name).
- Environment files control API base URL: `.env.docker` for Docker, `.env.development` for local dev.

### Frontend architecture

- **Legacy**: Static HTML/JS in `public/`, served by Express on port 80.
- **React SPA**: React (Vite) in `react_app/`, containerized with Docker.
  - Framework: React with Vite for build tooling and hot-reload.
  - Language: TypeScript (`.tsx` files for components, `.ts` for utilities).
  - Styling: Tailwind CSS v4 + daisyUI v5 (components like navbar, card, btn, badge; themes via `data-theme`).
  - State Management: Redux Toolkit for global state (user management).
  - Routing: React Router for SPA navigation (/, /my_projects/:nutzer, /project/:proj_id, /project/:proj_id/edit, /new_project).
  - Containerized: Runs in Docker on port 5174 (mapped from 5173 inside container).
  - Hot-reload: Vite dev server with `--host` flag for accessibility from host machine.
  - API Communication: Fetches from backend via Docker Compose network (`http://backend:80`).
  - Features: Full CRUD for projects, helpers, comments; project detail pages; user management; theme switching.

### CORS

- Backend configured with manual CORS middleware to allow React app origins:
  - `http://localhost:5173` (local dev)
  - `http://localhost:5174` (Docker dev)
