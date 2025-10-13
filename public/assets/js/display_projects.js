"use strict"

import {getProjectsJsonPromise} from './crud.js';
import dom from './dom.js';

let elProjects = document.getElementById('projects');

const displayProjects = () => {
    getProjectsJsonPromise().then(
        projectsJson => {
            console.log(projectsJson.map(project => project.proj_name));
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
    let elTitle = dom.create({
        tagName: 'h2',
        content: projectDoc.proj_name,
        cssClassName: 'project',
        parent: elProject,
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
    console.log(projectDoc);
}

displayProjects();