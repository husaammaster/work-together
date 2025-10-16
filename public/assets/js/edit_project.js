"use strict"

import {getProjectByIdPromise} from './crud.js';
import dom from './dom.js';
import elements from './elements.js';
import {deleteProject, updateProject} from './crud.js';


const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
const nutzer = urlParams.get('nutzer');

elements.elMain = document.querySelector('main');
elements.elNutzername = document.querySelector('#nutzername');
elements.elNutzername.value = nutzer;
elements.elNutzername.addEventListener('change', () => {
    // window.location.href = `edit_project.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
});

elements.elForm = document.querySelector('#add_project_form');
elements.elProjName = document.querySelector('#proj_name');
elements.elProjOwner = document.querySelector('#proj_owner');
elements.elDescription = document.querySelector('#description');
elements.elMaxHelpers = document.querySelector('#maxHelpers');
elements.elItems = document.querySelector('#items');

elements.elSubmitButton = document.querySelector('#submit_button');
elements.elSubmitButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    console.log("\nClient: Projekt aktualisiert angefordert");
    getProjectByIdPromise(projectId)
    .then(project => {
        console.log("\nClient: Projekt wurde erfolgreich geladen -> result: ", project);
        updateProject( {
                proj_id: projectId,
                _rev: project._rev,
                proj_name: elements.elProjName.value,
                nutzer: elements.elProjOwner.value,
                description: elements.elDescription.value,
                maxHelpers: elements.elMaxHelpers.value,
                items: elements.elItems.value.split(',').map(item => item.trim())
            })
    })
    .catch(error => {
        console.warn('Error updating project:', error);
    });
});


console.log("URL Parameter: projectId = " + projectId + ", nutzer = " + nutzer);

const loadProject = () => {
    getProjectByIdPromise(projectId)
    .then(project => {
        elements.elProjName.value = project.proj_name;
        elements.elProjOwner.value = project.nutzer;
        elements.elDescription.value = project.description;
        elements.elMaxHelpers.value = project.maxHelpers;
        elements.elItems.value = project.items.join(', ');
    });    
}

loadProject();


