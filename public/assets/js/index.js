"use strict"

import randomStrings from '../randomStrings.json' with {type: 'json'};
import {createProject} from './crud.js';
import {displayProjects} from './display_projects.js';

console.log('Happy developing ✨')
console.log("Länge", randomStrings.projects.length)

Promise.all(randomStrings.projects.map(project => {
    console.log("Projekt name", project.proj_name) 
    return createProject(project)
})).then(() => {
    displayProjects();
}). catch(
    console.warn
)
