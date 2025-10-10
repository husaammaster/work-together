"use strict"

import { dbScope, dbNames } from '../datenbanken/openDBs.js';
import {server} from '../server.js';

// ============ HEALTH CHECK ============
server.get('/backend_health', (request, response) => {
    response.json({ status: 'ok', message: 'Backend läuft' });
});

// ============ PROJECTS ============
// Get all projects
server.get('/projects', (request, response) => {
    console.log('Alle Projekte angefordert');
    const projectsDB = dbScope.use(dbNames.a_projects);
    projectsDB.list({ include_docs: true }).then(
        result => result.rows.map(row => row.doc)
    ).then(
        result => response.json(result) // hängt die Daten an die Antwort zum Client
    ).catch(
        console.warn
    );
});

// Post a project
server.post('/new_project', (request, response) => {
    console.log('Neues Projekt angefordert');
    const projectsDB = dbScope.use(dbNames.a_projects);
    
    const project = request.body; 
    // { title, description, maxHelpers, items, ... }

    projectsDB.insert(project).then(
        console.log('Projekt angelegt:', project)
    ).catch(
        console.warn
    );
});
