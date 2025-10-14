"use strict"

import {getProjectByIdPromise} from './crud.js';
import dom from './dom.js';
import elements from './elements.js';
import {deleteProject} from './crud.js';

// parse URL parameters and open the project with the given id
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
const nutzer = urlParams.get('nutzer');

console.log("URL Parameter: projectId = " + projectId + ", nutzer = " + nutzer);

elements.elMain = document.querySelector('main');
elements.elNutzername = document.querySelector('#nutzername');
elements.elNutzername.value = nutzer;
elements.elNutzername.addEventListener('change', () => {
    window.location.href = `project_page.html?id=${projectId}&nutzer=${elements.elNutzername.value}`;
});

getProjectByIdPromise(projectId).then(project => {
    createElProjectPage(project, nutzer == project.nutzer);
});
    

const createElProjectPage = (projectDoc, my_project = false) => {
    let elProject = dom.create({
        tagName: 'div',
        cssClassName: 'project',
        parent: elements.elMain,
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
    let elLink = dom.create({
        tagName: 'a',
        href: `project_page.html?id=${projectDoc._id}&nutzer=${elements.elNutzername.value}`,
        styles: {
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'inherit'
        },
        parent: elHeader,
    });
    let elTitle = dom.create({
        tagName: 'h4',
        content: projectDoc.proj_name,
        cssClassName: 'project',
        parent: elLink,
    });

    let my_style = {}
    if (my_project) {
        my_style = {
            backgroundColor: 'lightblue',
        }
    }
    let elUser = dom.create({
        tagName: 'h5',
        content: "Projekt von: " + projectDoc.nutzer,
        cssClassName: 'project',
        parent: elHeader,
        styles: my_style,
    });
    if (my_project) {
        let elDeleteButton = dom.create({
            tagName: 'button',
            content: "Löschen und zurück zu Home",
            cssClassName: 'del_project',
            parent: elHeader,
            listeners: {
                click: () => {deleteProject(projectDoc._id, projectDoc._rev).then(
                    () => window.location.href = "index.html"
                    ).catch(
                        console.warn
                    )
                }
            }
        });
    }
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