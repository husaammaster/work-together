"use strict"

import express from 'express';
export const server = express();

server.use(express.static('./public'));
server.use(express.json());

const port = process.env.PORT || 80;

export const init = () => {
    server.listen(port, err => {
        if(err) console.log(err)
        else console.log('Server läuft');
    });
}

