"use strict"

import {getProjectsJsonPromise, deleteProject} from './crud.js';
import dom from './dom.js';
import elements from './elements.js';
import randomStrings from '../randomStrings.json' with {type: 'json'};
import {getHelperList} from './crud.js';

elements.elNutzername = document.querySelector('#nutzername');

const randomName = () => {
    return randomStrings.users[Math.floor(Math.random() * randomStrings.users.length)]
}
elements.elNutzername.value = randomName();

let elProjects = document.getElementById('projects');

export const displayProjects = (filter = "") => {
    elProjects.innerHTML = "";
    getProjectsJsonPromise(filter).then(
        projectsJson => {
            projectsJson.map(project => createElProject(project, project.nutzer === elements.elNutzername.value, filter));
        }
    ).catch(
        console.warn
    );
}

const createElProject = (projectDoc, my_project = false, filter = "") => {
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
        cssClassName: 'title',
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
        cssClassName: 'user',
        parent: elHeader,
        styles: my_style,
    });
    if (my_project) {
        let elDeleteButton = dom.create({
            tagName: 'button',
            content: "Löschen",
            cssClassName: 'del_project',
            parent: elHeader,
            listeners: {
                click: () => {deleteProject(projectDoc._id, projectDoc._rev).then(
                    () => displayProjects(filter)
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
        cssClassName: 'description',
        parent: elProject,
    });
    getHelperList(projectDoc._id)
    .then(result => {
        let color = "black"
        if (result.docs.length == projectDoc.maxHelpers)
            color = "limegreen"
        else if (result.docs.length < projectDoc.maxHelpers/4)
            color = "red"
        else if (result.docs.length < projectDoc.maxHelpers/2)
            color = "orange"
        else if (result.docs.length > projectDoc.maxHelpers)
            color = "lightgray"
        let elMaxHelpers = dom.create({
            tagName: 'p',
            content: "Anzahl gesuchter Helfer: " + result.docs.length + " / " + projectDoc.maxHelpers,
            cssClassName: 'maxHelpers',
            parent: elProject,
            styles: {
                color: color,
            },
        })}
    )
    let elListe = dom.create({
        tagName: 'p',
        content: "Liste der Materialien: ",
        cssClassName: 'listTitle',
        parent: elProject,
    });
    let elItems = dom.create({
        tagName: 'ul',
        cssClassName: 'listItems',
        parent: elProject,
    });
    projectDoc.items.map(item => {
        let elItem = dom.create({
            tagName: 'li',
            content: item,
            cssClassName: 'item',
            parent: elItems,
        });
    });
}