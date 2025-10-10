"use strict"

import { WebSocketServer } from 'ws';
import wsHandlers from './wsMessageHandlers.js'

export const wsServer = new WebSocketServer({ port: 8080 });

export const init = () => {

    wsServer.on("listening", () => {
        console.log("WebSocket-Server started on port 8080");
    });

    wsServer.on("connection", (ws) => {
        console.log("Client connected to WebSocket-Server");
        ws.on("message", (message) => {
            message = JSON.parse(message.toString());
            console.log("Received message", message);


            if (wsHandlers[message.type]) {
                wsHandlers[message.type](message.payload)
            } else {
                console.log(`Der Nachrichtentyp ${message.type} ist unbekannt`);
            }

        });

        
    });
}