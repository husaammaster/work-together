"use strict"
import elements from './elements.js';
elements.elNutzername=document.querySelector('#nutzername');


export const deleteProject = (_id, _rev) => {
    return fetch('/delete_project', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'  // ← ADD THIS
        },
        body: JSON.stringify({ _id, _rev })
    })
    .then(res => res.json())
    .then(data => {
        console.log('\nClient: Projekt wurde erfolgreich gelöscht -> result: ', data);
        return data;
    });
}

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
        console.log('\nClient: Projekt wurde erfolgreich angelegt -> result: ', data);
        return data;
    });
}

export const getProjectsJsonPromise = (filter) => {
    let result = undefined;
    return fetch('/projects', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'  // ← ADD THIS
        },
        body: JSON.stringify({filter})
    })
    .then(res => res.json())
    .then(data => {
        result = data; 
        console.log('\nClient: Alle Projekte angefordert -> result: ', result)
        return result;
    })
}

export const getProjectByIdPromise = (_id) => {
    let result = undefined;
    return fetch('/project_page', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'  // ← ADD THIS
        },
        body: JSON.stringify({_id})
    })
    .then(result => result.json())
    .then(data => {
        result = data; 
        console.log('\nClient: Projekt mit ID ' + _id + ' angefordert -> result: ', result)
        return result;
    })
}