"use strict"

import {getProjectsJsonPromise} from './crud.js';

let elProjects = document.getElementById('projects');

const displayProjects = () => {
    getProjectsJsonPromise().then(
        projectsJson => {
            console.log(projectsJson.map(project => project.proj_name));
            elProjects.append(projectsJson.map(project => getElProject(project)));
        }
    ).catch(
        console.warn
    );
}

const getElProject = (projectDoc) => {
    let elProject = document.createElement('div');
    elProject.textContent = projectDoc.proj_name;
    return elProject;
}

displayProjects();