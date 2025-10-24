## Tech Stack

- Backend: Node.js (ES modules), Express
- Database: CouchDB (client: `nano`)
- Realtime: WebSocket (`ws`)
- Dev tooling: nodemon, Docker, Docker Compose

### Repository layout

- `server/` backend (Express API, WS)
- `public/` static frontend assets
- `Dockerfile` Node image for backend service
- `compose.yaml` multi-service dev (web + couchdb)

### Development workflow

- File sync via Docker Compose develop.watch
  - Start in watch mode: `docker compose up --watch`
  - `services.web.develop.watch` syncs project files to `/app` and rebuilds on `package*.json` changes.
  - Backend restarts via nodemon on changes under `server/`.
  - Frontend changes under `public/` are served on browser refresh (no server restart required).

### Nodemon

- Script: `npm run dev` → `nodemon server/backend.js`
- Config (`nodemon.json`): watches `server/`, ignores `public/**` and `node_modules/**`, uses polling (`legacyWatch: true`) for reliability in Docker.

### Containers / services

- `server`: Node backend (exposes port 80), runs `npm run dev` (overrides image CMD at runtime).
- `couchdb`: Apache CouchDB (exposes 5984) with healthcheck.

Notes:

- `develop.watch` rules are active only when starting with `docker compose up --watch` (or `docker compose watch`).

### Frontend containerization

- Status: deferred. Currently `public/` is served via Express. A separate frontend container may be introduced later pending scope clarification.
