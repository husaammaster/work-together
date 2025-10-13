"use strict";

import { dbScope, dbNames } from "../datenbanken/openDBs.js";
import { server } from "../server.js";

// ============ HEALTH CHECK ============
server.get("/backend_health", (request, response) => {
  response.json({ status: "ok", message: "Backend läuft" });
});

// ============ PROJECTS ============
// Get all projects
server.get("/projects", (request, response) => {
  console.log("\nServer: Alle Projekte von einem Client angefordert");
  const projectsDB = dbScope.use(dbNames.a_projects);
  projectsDB
    .list({ include_docs: true })
    .then((result) => result.rows.map((row) => row.doc))
    .then(
      (result) => response.json(result) // hängt die Daten an die Antwort zum Client
    )
    .catch(console.warn);
});

// Post a project
server.post("/new_project", (request, response) => {
  console.log("\nServer: Neues Projekt angelgen angefordert");
  const projectsDB = dbScope.use(dbNames.a_projects);

  const project = request.body;
  // { title, description, maxHelpers, items, ... }

  let duplicate = undefined;
  projectsDB
    .list({ include_docs: true })
    .then((result) => {
      duplicate = result.rows.find(
        (row) => row.doc.proj_name === project.proj_name
      );
    })
    .then(() => {
      if (duplicate != undefined) {
        console.log("\nServer: Projekt existiert bereits:", duplicate.doc.proj_name);
        response.status(409).json({
          success: false,
          message: "Ein Projekt mit diesem Titel existiert bereits",
          existingProject: duplicate,
        });
      } else {
        console.log("\n Server: Projekt gestartet: ", project.proj_name);
        projectsDB
          .insert(project)
          .then(console.log("\nServer: Projekt angelegt:", project.proj_name))
          .then(
            () => response.json({ success: true, message: "Projekt angelegt" })
          )
          .catch(console.warn);
      }
    })
    .catch(console.warn);
});
