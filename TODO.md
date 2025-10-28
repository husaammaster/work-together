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

### Next Task (today/this week)

- Merge full legacy functionality from `/public` into React SPA.
  - Project create/edit forms (add_project.html → form component).
  - **Project detail page (project_page.html → routed component with /project_page fetch)**:
    - Display full project data
    - Show owner badge
    - Edit/Delete buttons (visible only to owner)
    - Helper list & join/leave buttons
    - Comments list & add/delete
    - Material list
  - My projects filter (my_projects.html → filter by user).
  - Helper join/leave (frontend for /join_project, /leave_project).
  - Comment list/add/delete (frontend for /comment_list, /new_comment, /delete_comment).

### Future Tasks

- Containerize React app and integrate into Docker Compose.
- Test full CRUD in Docker environment.
