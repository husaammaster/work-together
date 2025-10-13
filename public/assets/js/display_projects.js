"use strict"

import {getProjectsJsonPromise} from './crud.js';
import dom from './dom.js';
import elements from './elements.js';
import randomStrings from '../randomStrings.json' with {type: 'json'};

elements.elNutzername = document.querySelector('#nutzername');

const randomName = () => {
    return randomStrings.users[Math.floor(Math.random() * randomStrings.users.length)]
}
elements.elNutzername.value = randomName();

let elProjects = document.getElementById('projects');

export const displayProjects = (nutzer = "") => {
    elProjects.innerHTML = "";
    getProjectsJsonPromise(nutzer).then(
        projectsJson => {
            projectsJson.map(project => createElProject(project));
        }
    ).catch(
        console.warn
    );
}

const createElProject = (projectDoc) => {
    let elProject = dom.create({
        tagName: 'div',
        cssClassName: 'project',
        parent: elProjects,
    });
    let elHeader = dom.create({
        tagName: 'div',
        styles: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        cssClassName: 'project',
        parent: elProject,
    });
    let elTitle = dom.create({
        tagName: 'h4',
        content: projectDoc.proj_name,
        cssClassName: 'project',
        
        parent: elHeader,
    });
    let elUser = dom.create({
        tagName: 'h5',
        content: "Projekt von: " + projectDoc.nutzer,
        cssClassName: 'project',
        parent: elHeader,
    });
    let elDescription = dom.create({
        tagName: 'p',
        content: projectDoc.description,
        cssClassName: 'project',
        parent: elProject,
    });
    let elMaxHelpers = dom.create({
        tagName: 'p',
        content: "Anzahl gesuchter Helfer: " + projectDoc.maxHelpers,
        cssClassName: 'project',
        parent: elProject,
    });
    let elListe = dom.create({
        tagName: 'p',
        content: "Liste der Materialien: ",
        cssClassName: 'project',
        parent: elProject,
    });
    let elItems = dom.create({
        tagName: 'ul',
        cssClassName: 'project',
        parent: elProject,
    });
    projectDoc.items.map(item => {
        let elItem = dom.create({
            tagName: 'li',
            content: item,
            cssClassName: 'project',
            parent: elItems,
        });
    });
}