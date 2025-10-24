"use strict"

import express from 'express';
export const server = express();

server.use(express.static('./public'));
server.use(express.json());

// CORS middleware to allow React app on localhost:5173
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const port = process.env.PORT || 80;

export const init = () => {
    server.listen(port, err => {
        if(err) console.log(err)
        else console.log('Server läuft');
    });
}

