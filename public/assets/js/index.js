"use strict"

import randomStrings from '../randomStrings.json' with {type: 'json'};
import {createProject} from './crud.js';
import {displayProjects} from './display_projects.js';
import elements from './elements.js';
import dom from './dom.js';

elements.elNutzername = document.querySelector('#nutzername');
elements.elMain = document.querySelector('main');

const randomName = () => {
    return randomStrings.users[Math.floor(Math.random() * randomStrings.users.length)]
}
elements.elNutzername.value = randomName();

console.log('Happy developing ✨')
console.log("Länge", randomStrings.projects.length)



const addAllProjects = () => {
    Promise.all(randomStrings.projects.map(project => {
        console.log("Projekt name", project.proj_name) 
        project.nutzer = randomName()
        return createProject(project)
    })).then(() => {
        displayProjects();
    }). catch(
        console.warn
    )
}

dom.create({
    tagName: 'button',
    content: 'Add all projects',
    cssClassName: 'button button--primary',
    parent: elements.elMain,
    listeners: {
        click: addAllProjects
    }
})


displayProjects();

elements.elNutzername.addEventListener('change', () => {
    displayProjects()
})
