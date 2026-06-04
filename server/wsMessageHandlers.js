// WebSocket message handlers. Each handler is called as
//   handler(payload, { ws, broadcast })
// and may be async. This is the real-time core: comments, helpers and project
// deletions are persisted to CouchDB and pushed to the relevant clients so open
// pages stay in sync without polling.
//
// Rooms:
//   - subscribe          → a single project's page (comments + helpers + deletion)
//   - subscribe_projects → the project list (add/update/delete + live counts)

import { dbScope, dbNames } from "./datenbanken/openDBs.js";

const commentsDB = () => dbScope.use(dbNames.a_comments);
const helpersDB = () => dbScope.use(dbNames.b_proj_helper_user_rel);

// Count helpers + comments for a project (single project, used after a mutation).
async function projectCounts(proj_id) {
  const [helpers, comments] = await Promise.all([
    helpersDB().find({ selector: { proj_id: { $eq: proj_id } } }),
    commentsDB().find({ selector: { proj_id: { $eq: proj_id } } }),
  ]);
  return {
    proj_id,
    helperCount: helpers.docs.length,
    commentCount: comments.docs.length,
  };
}

// Recompute a project's counts and push them to the project-list room.
export async function broadcastCounts(proj_id, broadcast) {
  broadcast({ type: "counts_updated", payload: await projectCounts(proj_id) }, { projectsRoom: true });
}

const wsHandlers = {
  // ----- room subscriptions -----
  subscribe(payload, { ws }) {
    ws.projId = payload?.proj_id;
  },
  subscribe_projects(_payload, { ws }) {
    ws.projectsRoom = true;
  },

  // ----- comments -----
  async new_comment(payload, { broadcast }) {
    const comment = {
      proj_id: payload.proj_id,
      comment: payload.comment,
      user: payload.user,
      timestamp: payload.timestamp ?? Date.now(),
    };
    const res = await commentsDB().insert(comment);
    const saved = { _id: res.id, _rev: res.rev, ...comment };
    broadcast({ type: "comment_added", payload: saved }, { projId: comment.proj_id });
    await broadcastCounts(comment.proj_id, broadcast);
  },

  async delete_comment(payload, { broadcast }) {
    const { _id, _rev, proj_id } = payload;
    await commentsDB().destroy(_id, _rev);
    broadcast({ type: "comment_deleted", payload: { _id, proj_id } }, { projId: proj_id });
    await broadcastCounts(proj_id, broadcast);
  },

  // ----- helpers -----
  // Join: idempotent (no duplicate helper docs for the same person).
  async join_project(payload, { broadcast }) {
    const { proj_id, helper } = payload;
    const existing = await helpersDB().find({
      selector: { proj_id: { $eq: proj_id }, helper: { $eq: helper } },
    });
    if (existing.docs.length === 0) {
      await helpersDB().insert({ proj_id, helper });
    }
    broadcast({ type: "helper_added", payload: { proj_id, helper } }, { projId: proj_id });
    await broadcastCounts(proj_id, broadcast);
  },

  // Leave / remove a helper. Used both by a helper leaving themselves and by the
  // project owner removing someone (same operation, keyed by helper name).
  async leave_project(payload, { broadcast }) {
    const { proj_id, helper } = payload;
    const found = await helpersDB().find({
      selector: { proj_id: { $eq: proj_id }, helper: { $eq: helper } },
    });
    const doc = found.docs[0];
    if (doc) await helpersDB().destroy(doc._id, doc._rev);
    broadcast({ type: "helper_removed", payload: { proj_id, helper } }, { projId: proj_id });
    await broadcastCounts(proj_id, broadcast);
  },

  // ----- projects -----
  async delete_project(payload, { broadcast }) {
    const { _id, _rev } = payload;
    await dbScope.use(dbNames.a_projects).destroy(_id, _rev);
    // Tell the open detail page (project room) and every list (projects room).
    broadcast({ type: "project_deleted", payload: { _id } }, { projId: _id });
    broadcast({ type: "project_deleted", payload: { _id } }, { projectsRoom: true });
  },
};

export default wsHandlers;
