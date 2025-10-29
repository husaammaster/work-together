## Current To Dos

### Completed

- Set up React (Vite) app in `react_app/` with Tailwind.
- Configure CORS in backend for React app on `localhost:5173`.
- Implement basic ProjectList with fetch from `/projects` endpoint.
- Set up Redux Toolkit for state management (store and user slice).
- Update docs (TECHSTACK.md, README.md, FILESTRUCTURE.md) with current architecture.
- Better styling and dark mode toggle in header (using daisyUI).
- Add React Router for SPA navigation (/, /my-projects, /projects/:id, /projects/new, /projects/:id/edit).
- Migrate React app to TypeScript (`.tsx` files, type definitions).
- Fix TypeScript entry point in `index.html` (main.tsx instead of main.jsx).
- Merge full legacy functionality from `/public` into React SPA:
  - Project create form (AddProjectForm.tsx)
  - Project edit form (EditProjectForm.tsx) with ownership transfer
  - Project detail page with edit/delete buttons (owner only)
  - Helper list with join/leave functionality and color-coded status
  - Comment list with add/delete functionality and project owner badge
  - My projects filter by user
  - All CRUD operations for projects, helpers, comments

### Completed (React Containerization)

- Containerize React app with Docker (Dockerfile for dev mode)
- Set up Vite dev server with `--host` flag for accessibility
- Configure environment files (`.env.development`, `.env.docker`, `.env.production`)
- Add React service to Docker Compose with file sync and hot-reload
- Fix CORS to allow both `localhost:5173` and `localhost:5174`
- Test full CRUD flow end-to-end in Docker

### Project Status

**FINISHED** - All core features implemented and containerized:

- Backend: Express API with CouchDB, all CRUD endpoints functional
- Frontend: React SPA with full feature parity to legacy frontend
- Containerization: Both backend and frontend run in Docker with hot-reload
- Development: `docker compose up --watch` for seamless development

### Future Tasks

- Bug fixes and optimizations as needed
- Production deployment configuration
- Performance monitoring and optimization
