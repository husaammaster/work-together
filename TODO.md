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

### Next Task (today/this week)

- Test full CRUD flow end-to-end
- Containerize the React app, to get reproducible builds
- Test full frontend in docker-built frontend

### Future Tasks

- none -> start next project
