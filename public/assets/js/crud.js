"use strict"


export const createProject = () => {
    fetch('./new_project', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'  // ← ADD THIS
        },
        body: JSON.stringify({
            "proj_name": 'NeBaukasten 3 Projekt',
            "description": 'Neues Projekt als Test',
            "maxHelpers": 2,  // ← Should be number, not string
            "items": ["zwei linke Schrauben", "zwei rechte Schrauben", "zwei linke Nieten", "nur eine rechte Nieten"]
        })
    })
    .then(res => res.json())
    .then(data => console.log('\nProject created:', data))
    .catch(err => console.warn('\nError creating project:', err));
}

export const getProjectsJsonPromise = () => {
    let result = undefined;
    return fetch('./projects')
    .then(res => res.json())
    .then(data => {
        result = data; 
        console.log('\nProjects:', result)
        return result;
    })
}