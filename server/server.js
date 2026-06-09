"use strict";

import express from "express";
export const server = express();

server.use(express.static("./public"));
server.use(express.json());

// CORS middleware to allow React app on localhost:5101 (local dev) and localhost:5174 (docker dev)
// Ports: see ../../PORTS.md (work-together block 5100–5199). Local dev moved 5173 -> 5101.
server.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5101", "http://localhost:5174"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Port: see ../../PORTS.md (work-together backend = 5100). Was 80, which needed
// sudo for local dev and parked the host's standard HTTP port.
const port = process.env.PORT || 5100;

export const init = () => {
  server.listen(port, (err) => {
    if (err) console.log(err);
    else console.log("Server läuft");
  });
};
