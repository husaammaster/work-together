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

  const filter = request.body.filter;
  if (filter != "") {
    console.log(`\nServer: User \"${filter}\" requested his own projects`)
    projectsDB.find({
            selector:{
                'nutzer': {
                    $eq: filter
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



// Post create a project
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


server.post("/delete_project", (request, response) => {
  console.log("\nServer: Projekt gelöscht angefordert");
  const projectsDB = dbScope.use(dbNames.a_projects);
  const _id = request.body._id;
  const _rev = request.body._rev;
  console.log("\nServer: Projekt gelöscht angefordert: ", _id, _rev);
  projectsDB.destroy(_id, _rev)
    .then(console.log("\nServer: Projekt gelöscht: ", _id, _rev))
    .then(
      () => response.json({ success: true, message: "Projekt gelöscht" })
    )
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

server.post("/project_page", (request, response) => {
  console.log("\nServer: Projektseite angefordert");
  const projectsDB = dbScope.use(dbNames.a_projects);
  const _id = request.body._id;
  console.log("\nServer: Projektseite von _id: ", _id , "angefordert");
  projectsDB.get(_id)
    .then(
      result => {
        console.log("\nServer: Projektseite von _id: ", _id , "gelesen: ", result.docs)
        response.json(result)
      }
    ).catch(console.warn);
})




// =====HELPERLISTE=====

server.post("/helper_list", (request, response) => {
  console.log("\nServer: Helferliste angefordert");
  const projectHelpersDB = dbScope.use(dbNames.b_proj_helper_user_rel);
  const proj_id = request.body.proj_id;
  console.log("\nServer: Helferliste von Projekt " + proj_id + " angefordert");
  projectHelpersDB.find({
    selector: {
      proj_id: {
        $eq: proj_id
      }
    }
  }).then(
    result => {
      console.log("\nServer: Helferliste von Projekt " + proj_id + " gelesen: ", result.docs)
      response.json(result)
    }
  ).catch(console.warn);
})

server.post("/join_project", (request, response) => {
  console.log("\nServer: Join Helferliste angefordert");
  const projectHelpersDB = dbScope.use(dbNames.b_proj_helper_user_rel);
  const proj_id = request.body.proj_id;
  const helper = request.body.helper;
  console.log("\nServer: Join Helferliste von Projekt " + proj_id + " angefordert");
  projectHelpersDB.find({
    selector: {
      proj_id: {
        $eq: proj_id
      },
      helper: {
        $eq: helper
      }
    }
  })
  .then(result => {
    if (result.docs.length > 0) {
      console.log("\nServer: Helfer " + helper + " ist bereits in der Helferliste von Projekt " + proj_id)
      response.json({ success: false, message: "Helfer " + helper + " ist bereits in der Helferliste von Projekt " + proj_id })
    }
    else {
      projectHelpersDB.insert({proj_id, helper})
    .then(console.log("\nServer: Join Helferliste von Projekt " + proj_id + " angefordert"))
    .then(
      () => response.json({ success: true, message: "Projekt angelegt" })
    )
    .catch(console.warn)
    }
  })
})

server.post("/leave_project", (request, response) => {
  console.log("\nServer: Leave Helferliste angefordert");
  const projectHelpersDB = dbScope.use(dbNames.b_proj_helper_user_rel);
  const proj_id = request.body.proj_id;
  const helper = request.body.helper;
  console.log("\nServer: Leave Helferliste von Projekt " + proj_id + " angefordert");
  projectHelpersDB.find({
    selector: {
      proj_id: {
        $eq: proj_id
      },
      helper: {
        $eq: helper
      }
    }
  }).then(
    result => {
      console.log("\nServer: Helfereintrag existiert: ", result.docs[0])
      return result.docs[0];
    }
  ).then((result) => {
      console.log("\nServer: Eintrag " + helper + " von Projekt " + proj_id + " wird entfernt")
      projectHelpersDB.destroy(result._id, result._rev)
    })
    .then(console.log("\nServer: Eintrag " + helper + " von Projekt " + proj_id + " entfernt"))
    .then(
      () => response.json({ success: true, message: "Projekt angelegt" })
    )
    .catch(console.warn);
})




// ======== COMMENTS ========

server.post("/new_comment", (request, response) => {
  console.log("\nServer: Neuer Kommentar angefordert");
  const commentsDB = dbScope.use(dbNames.a_comments);
  const comment = {
    proj_id: request.body.proj_id,
    comment: request.body.comment,
    user: request.body.user,
    timestamp: request.body.timestamp,
  };
  console.log("\nServer: Neuer Kommentar angefordert: ", comment);
  commentsDB.insert(comment)
    .then(result => console.log("\nServer: Neuer Kommentar angefordert: ", result))
    .then(
      () => response.json({ success: true, message: "Projekt angelegt" })
    )
    .catch(console.warn); 
})

server.post("/delete_comment", (request, response) => {
  console.log("\nServer: Kommentar löschen angefordert");
  const commentsDB = dbScope.use(dbNames.a_comments);
  const comment_id = request.body._id;
  const comment_rev = request.body._rev;
  console.log("\nServer: Kommentar löschen angefordert: ", comment_id, comment_rev);
  commentsDB.destroy(comment_id, comment_rev)
    .then(console.log("\nServer: Kommentar löschen erfolgreich: ", comment_id, comment_rev))
    .then(
      () => response.json({ success: true, message: "Projekt angelegt" })
    )
    .catch(console.warn); 
})

server.post("/comment_list", (request, response) => {
  console.log("\nServer: Kommentarliste angefordert");
  const commentsDB = dbScope.use(dbNames.a_comments);
  const proj_id = request.body.proj_id;
  console.log("\nServer: Kommentarliste von Projekt " + proj_id + " angefordert");
  commentsDB.find({
    selector: {
      proj_id: {
        $eq: proj_id
      }
    }
  }).then(
    result => {
      console.log("\nServer: Kommentarliste von Projekt " + proj_id + " gelesen: ", result.docs)
      response.json(result)
    }
  ).catch(console.warn); 
})