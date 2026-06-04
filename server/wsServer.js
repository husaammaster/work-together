"use strict"

import { WebSocketServer, WebSocket } from 'ws';
import wsHandlers from './wsMessageHandlers.js'

export const wsServer = new WebSocketServer({ port: 8080 });

/**
 * Broadcast a message to connected clients, optionally scoped to a "room".
 *
 * Rooms:
 *   - per project: clients that sent `subscribe { proj_id }` (→ `client.projId`)
 *   - the project list: clients that sent `subscribe_projects` (→ `client.projectsRoom`)
 *
 * @param {object} data               Message to send (will be JSON-stringified).
 * @param {object} [opts]
 * @param {string} [opts.projId]      Only clients subscribed to this project.
 * @param {boolean} [opts.projectsRoom] Only clients subscribed to the project list.
 * @param {WebSocket} [opts.except]   Skip this socket (e.g. the original sender).
 */
export const broadcast = (data, { projId, projectsRoom, except } = {}) => {
    const json = JSON.stringify(data);
    for (const client of wsServer.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        if (except && client === except) continue;
        if (projId && client.projId !== projId) continue;
        if (projectsRoom && !client.projectsRoom) continue;
        client.send(json);
    }
};

export const init = () => {

    wsServer.on("listening", () => {
        console.log("WebSocket-Server started on port 8080");
    });

    wsServer.on("connection", (ws) => {
        console.log("Client connected to WebSocket-Server");

        ws.on("message", async (raw) => {
            let message;
            try {
                message = JSON.parse(raw.toString());
            } catch {
                console.warn("WS: received non-JSON message, ignoring");
                return;
            }

            const handler = wsHandlers[message.type];
            if (!handler) {
                console.log(`Der Nachrichtentyp ${message.type} ist unbekannt`);
                return;
            }

            try {
                await handler(message.payload, { ws, broadcast });
            } catch (err) {
                console.warn(`WS handler "${message.type}" failed:`, err);
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected from WebSocket-Server");
        });
    });
}
