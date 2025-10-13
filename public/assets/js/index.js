"use strict"

import randomStrings from '../randomStrings.json' with {type: 'json'};
import {socket} from './clientWebSocket.js';
import {createProject} from './crud.js';

console.log('Happy developing ✨')


setTimeout(() => {
    createProject();
}, 1000);
