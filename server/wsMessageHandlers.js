// WebSocket message handlers. Each handler is called as
//   handler(payload, { ws, broadcast })
// and may be async. This is where the real-time comment chat lives: comments
// are persisted to CouchDB and then pushed to every client subscribed to the
// same project, so open project pages update live without polling.

import { dbScope, dbNames } from "./datenbanken/openDBs.js";

const commentsDB = () => dbScope.use(dbNames.a_comments);

const wsHandlers = {
    // Client joins a project "room" so it only receives that project's traffic.
    subscribe(payload, { ws }) {
        ws.projId = payload?.proj_id;
        console.log(`WS: client subscribed to project ${ws.projId}`);
    },

    // Persist a new comment and broadcast it to everyone on the same project.
    async new_comment(payload, { broadcast }) {
        const comment = {
            proj_id: payload.proj_id,
            comment: payload.comment,
            user: payload.user,
            timestamp: payload.timestamp ?? Date.now(),
        };
        const res = await commentsDB().insert(comment);
        const saved = { _id: res.id, _rev: res.rev, ...comment };
        console.log(`WS: new comment ${res.id} on project ${comment.proj_id} by ${comment.user}`);
        broadcast({ type: "comment_added", payload: saved }, { projId: comment.proj_id });
    },

    // Delete a comment and tell everyone on the same project to drop it.
    async delete_comment(payload, { broadcast }) {
        const { _id, _rev, proj_id } = payload;
        await commentsDB().destroy(_id, _rev);
        console.log(`WS: deleted comment ${_id} on project ${proj_id}`);
        broadcast({ type: "comment_deleted", payload: { _id, proj_id } }, { projId: proj_id });
    },
};

export default wsHandlers;
