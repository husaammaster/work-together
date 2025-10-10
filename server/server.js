"use strict"

import express from 'express';
export const server = express();

server.use(express.static('./public'));
server.use(express.json());


export const init = () => {
    server.listen(80, err => {
        if(err) console.log(err)
        else console.log('Server läuft');
    });
}

