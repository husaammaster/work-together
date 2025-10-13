"use strict";

import { dbScope, dbNames } from "../datenbanken/openDBs.js";
import { server } from "../server.js";
import formidable from 'formidable';

// ============ HEALTH CHECK ============
server.get("/backend_health", (request, response) => {
  response.json({ status: "ok", message: "Backend läuft" });
});

// ============ PROJECTS ============ 
// Get all projects
server.post("/projects", (request, response) => {
  const projectsDB = dbScope.use(dbNames.a_projects);

  const nutzer = request.body.nutzer;
  if (nutzer != "") {
    console.log(`\nServer: User \"${nutzer}\" requested his own projects`)
    projectsDB.find({
            selector:{
                'nutzer': {
                    $eq: nutzer
                }
            }
      }).then(
          result => result.docs
      ).then(
          (result) => response.json(result) // hängt die Daten an die Antwort zum Client
      ).catch(
          console.warn
      )
  }
  else {
    console.log("\nServer: User requested all projects");
    projectsDB
      .list({ include_docs: true })
      .then((result) => result.rows.map((row) => row.doc))
      .then(
        (result) => response.json(result) // hängt die Daten an die Antwort zum Client
      )
      .catch(console.warn); 

  }

});

// Post a project
server.post("/new_project", (request, response) => {
  console.log("\nServer: Neues Projekt angelgen angefordert");
  const projectsDB = dbScope.use(dbNames.a_projects);

  const project = request.body;
  console.log("\nServer: Neues Projekt angelgen angefordert: ", project);
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


server.post('/processProjectForm', (request, response) => {
    const myForm = formidable();

    myForm.parse(request, (err, fields) => {
        if (err) console.log(err)
        else {
          const payload = {
            proj_name: fields.proj_name[0],
            description: fields.description[0],
            maxHelpers: parseInt(fields.maxHelpers[0], 10),
            items: fields.items[0]
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0)
          };
          console.log('Parsed payload:', payload);
        
          response.json(payload);
        }
    })
})