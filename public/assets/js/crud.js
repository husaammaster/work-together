"use strict"
import elements from './elements.js';
elements.elNutzername=document.querySelector('#nutzername');


export const createProject = ({
        nutzer = elements.elNutzername.value,
        proj_name = 'NeBaukasten 3 Projekt',
        description = 'Neues Projekt als Test',
        maxHelpers = 2,  // ← Should be number, not string
        items = ["zwei linke Schrauben", "zwei rechte Schrauben", "zwei linke Nieten", "nur eine rechte Nieten"]
    }) => {
    let project = {
        nutzer,
        proj_name,
        description,
        maxHelpers,
        items
    }
    return fetch('/new_project', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'  // ← ADD THIS
        },
        body: JSON.stringify(project)
    })
    .then(res => res.json())
    .then(data => {
        console.log('\nClient: Projekt wurde erfolgreich angelegt:', data.proj_name);
        return data;
    });
}

export const getProjectsJsonPromise = (nutzer) => {
    let result = undefined;
    return fetch('/projects', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'  // ← ADD THIS
        },
        body: JSON.stringify({nutzer})
    })
    .then(res => res.json())
    .then(data => {
        result = data; 
        console.log('\nClient: Alle Projekte angefordert -> ', result)
        return result;
    })
}