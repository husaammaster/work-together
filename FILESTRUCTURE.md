# Project File Structure

## Root Directory (`/`)

- `README.md`: Project overview, features, installation, and usage.
- `TECHSTACK.md`: Detailed technology stack and architecture.
- `TODO.md`: Current tasks, completed items, and future plans.
- `FILESTRUCTURE.md`: This file, describing the project layout.
- `LEARNED.md`: Documented learnings and technologies explored.
- `package.json`: Node.js dependencies and scripts.
- `compose.yaml`: Docker Compose configuration for multi-service development.
- `Dockerfile`: Docker image definition for the backend.
- `.env`: Environment variables (e.g., API base URL).
- `.gitignore`: Files to ignore in Git.
- `.dockerignore`: Files to exclude from Docker builds.
- `nodemon.json`: Nodemon configuration for development.

## `server/` Directory

Contains the backend Express.js API server.

- `backend.js`: Main server file with Express setup, routes, and WebSocket.
- `datenbanken/`: Database-related files.
  - `credentials.json`: CouchDB credentials.
  - `init.js`: Database initialization script.
- Other supporting files for API endpoints and logic.

## `public/` Directory

Legacy static frontend assets (HTML/JS/CSS).

- `index.html`: Main project overview page.
- `add_project.html`: Project creation form.
- `edit_project.html`: Project editing form.
- `my_projects.html`: User-specific projects filter.
- `project_page.html`: Project detail page.
- `styles.css`: Main stylesheet.
- Other HTML/JS files for pages and interactions.

## `react_app/` Directory

New React (Vite) single-page application frontend.

- `src/`: Source code.
  - `App.tsx`: Main app component with routing.
  - `Pages.tsx`: Page components (e.g., ProjectListPage, MyProjectsPage).
  - `Projects.tsx`: Project display component.
  - `store.js`: Redux store configuration.
  - `features/`: Redux slices and state management.
    - `userSlice.js`: User state slice.
  - `main.tsx`: App entry point with TypeScript support.
  - `types/`: TypeScript type definitions.
    - `index.ts`: Shared type definitions.
  - `App.css`: App-specific styles.
  - `index.css`: Global styles (Tailwind).
- `index.html`: Entry point with root div.
- `package.json`: React app dependencies.
- Other Vite config files.

## Other Directories

- `node_modules/`: Installed dependencies (ignored in Git).
- `.git/`: Git repository data.
- `.idea/`: IDE-specific files (optional).
