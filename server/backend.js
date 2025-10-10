"use strict"

import {dbScope, dbNames, init as initDBs} from "./datenbanken/openDBs.js";
import {server, init as initServer} from "./server.js";
import {wsServer, init as initWS} from "./wsServer.js";
import "./routes/api.js";


const init = () => {
    initDBs().then(
        () => initServer()
    ).catch(
        console.warn
    );
    initWS();
}

init();