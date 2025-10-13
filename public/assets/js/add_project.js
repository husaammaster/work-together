"use strict"

import {createProject} from './crud.js';
import elements from './elements.js';
import dom from './dom.js';

console.log('Happy developing ✨')

const domMapping = () => {
    elements.addProjectForm = document.querySelector('#add_project_form');
    console.log("Projekte: ", elements.addProjectForm)
    elements.elMain = document.querySelector('main');
    console.log("Projekte: ", elements.elMain)
}

const send = evnt => {
    evnt.preventDefault();

    const formData = new FormData(elements.addProjectForm);
    console.log("Form Data: ", Object.fromEntries(formData));

    fetch("/processProjectForm", {
        method: "POST",
        body: formData
    }).then(
        result => result.json()
    ).then(projectDoc => {
        return createProject(projectDoc)
            .then(() => {
                dom.create({
                    tagName: 'p',
                    content: 'Projekt angelegt: ' + projectDoc.proj_name,
                    cssClassName: 'project',
                    parent: elements.elMain,
                });
            });
    }).catch(err => {
        console.warn("Error:", err);
        dom.create({
            tagName: 'p',
            content: 'Fehler: ' + err.message,
            cssClassName: 'error',
            parent: elements.elMain,
        });
    });
}

const init = () => {
    domMapping();
    elements.addProjectForm.addEventListener('submit', send)
}

init()

