"use strict"

import {displayProjects} from './display_projects.js';
import randomStrings from '../randomStrings.json' with {type: 'json'};
import elements from './elements.js';

elements.elNutzername = document.querySelector('#nutzername');

const randomName = () => {
    return randomStrings.users[Math.floor(Math.random() * randomStrings.users.length)]
}
elements.elNutzername.value = randomName();

displayProjects(elements.elNutzername.value)

elements.elNutzername.addEventListener('change', () => {
    displayProjects(elements.elNutzername.value)
})