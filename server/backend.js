"use strict"

import {dbScope, dbNames, init as initDBs} from "./datenbanken/openDBs.js";
import {server, init as initServer} from "./server.js";


const init = () => {
    initDBs().then(
        () => initServer()
    ).catch(
        console.warn
    );
}

init();