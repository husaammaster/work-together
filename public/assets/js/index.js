"use strict"

import randomStrings from '../randomStrings.json' with {type: 'json'};
import {createProject} from './crud.js';
import {displayProjects} from './display_projects.js';
import elements from './elements.js';

elements.elNutzername = document.querySelector('#nutzername');

const randomName = () => {
    return randomStrings.users[Math.floor(Math.random() * randomStrings.users.length)]
}
elements.elNutzername.value = randomName();

console.log('Happy developing ✨')
console.log("Länge", randomStrings.projects.length)



Promise.all(randomStrings.projects.map(project => {
    console.log("Projekt name", project.proj_name) 
    project.nutzer = randomName()
    return createProject(project)
})).then(() => {
    displayProjects();
}). catch(
    console.warn
)
