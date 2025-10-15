"use strict"

import {getProjectsJsonPromise, deleteProject} from './crud.js';
import dom from './dom.js';
import elements from './elements.js';
import randomStrings from '../randomStrings.json' with {type: 'json'};
import {getHelperList, getCommentList} from './crud.js';



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

    const bootstrap_comment_icon = `<svg xmlns="http://www.w3.org/2000/svg" style="padding: 0; font-size: 1em; line-height: 1em; height: 0.8em; width: 1em; border-radius: 0;bottom:0; position:relative;" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
</svg>`;



    getCommentList(projectDoc._id).then(
        result => {
            let elNumComments = dom.create({
                tagName: 'p',
                content: "Anzahl Kommentare: " + result.docs.length + " " + bootstrap_comment_icon,
                cssClassName: 'numComments',
                parent: elProject,
            });
        }
    ).catch(console.warn)

    
}