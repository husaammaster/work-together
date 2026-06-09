// Canonical demo seed + a reset routine, exposed via POST /dev/seed.
//
// Used for local testing and for recording the gallery media: it puts the three
// databases into a known state with projects at deliberately different helper
// fill levels so the colour-coded counts (red / orange / green) all show up.
//
// Projects use FIXED _ids so tests and capture scripts can rely on them.

import { dbScope, dbNames } from "./datenbanken/openDBs.js";

export const SEED = {
  projects: [
    {
      _id: "seed-garden",
      proj_name: "Gemeinschaftsgarten anlegen",
      nutzer: "Alex",
      description:
        "Wir verwandeln eine Brachfläche in einen Nachbarschaftsgarten mit Hochbeeten und Sitzecke.",
      maxHelpers: 3,
      items: ["Spaten", "Erde", "Saatgut", "Holzbretter"],
    },
    {
      _id: "seed-fahrrad",
      proj_name: "Fahrrad-Reparaturcafé",
      nutzer: "Marie",
      description:
        "Monatliches Reparaturcafé, in dem wir gemeinsam Fahrräder wieder flott machen.",
      maxHelpers: 4,
      items: ["Werkzeug", "Schläuche", "Öl"],
    },
    {
      _id: "seed-lern",
      proj_name: "Lern-Patenschaften",
      nutzer: "Omar",
      description:
        "Schülerinnen und Schüler bekommen ehrenamtliche Nachhilfe in Mathe und Deutsch.",
      maxHelpers: 8,
      items: ["Whiteboard", "Stifte", "Übungshefte"],
    },
  ],
  // helper fill levels → badge colours: 2/3 orange, 0/4 red, 8/8 green
  helpers: {
    "seed-garden": ["Marie", "Omar"],
    "seed-fahrrad": [],
    "seed-lern": ["Kevin", "Sarah", "Leon", "Hannah", "Adam", "Leah", "Noah", "David"],
  },
  comments: {
    "seed-garden": [
      { user: "Marie", comment: "Ich bringe am Samstag zwei Spaten und Handschuhe mit!" },
      { user: "Alex", comment: "Super, danke Marie! Treffpunkt ist 10 Uhr am Eingang." },
    ],
    "seed-fahrrad": [],
    "seed-lern": [],
  },
};

// Delete every (non-design) document in a database. Safe for helpers/comments,
// which use server-generated ids (no fixed-id tombstone to clash with on reinsert).
async function clearDb(name) {
  const db = dbScope.use(name);
  const all = await db.list({ include_docs: true });
  const docs = all.rows
    .filter((r) => !r.id.startsWith("_design"))
    .map((r) => ({ _id: r.id, _rev: r.doc._rev, _deleted: true }));
  if (docs.length) await db.bulk({ docs });
}

/**
 * Reset the three databases to the canonical SEED state and return a summary.
 * Projects are upserted by fixed _id (so a deleted-then-reinserted tombstone
 * never causes a conflict); helpers and comments are cleared and reinserted.
 */
export async function seedDatabase() {
  const projectsDB = dbScope.use(dbNames.a_projects);
  const commentsDB = dbScope.use(dbNames.a_comments);
  const helpersDB = dbScope.use(dbNames.b_proj_helper_user_rel);

  // Upsert the seed projects by fixed id.
  for (const p of SEED.projects) {
    let _rev;
    try {
      _rev = (await projectsDB.get(p._id))._rev;
    } catch {
      // doesn't exist yet
    }
    await projectsDB.insert(_rev ? { ...p, _rev } : p);
  }

  // Remove any project that isn't part of the seed.
  const seedIds = new Set(SEED.projects.map((p) => p._id));
  const existing = await projectsDB.list();
  for (const row of existing.rows) {
    if (!row.id.startsWith("_design") && !seedIds.has(row.id)) {
      await projectsDB.destroy(row.id, row.value.rev);
    }
  }

  // Helpers + comments use generated ids → clear and reinsert.
  await clearDb(dbNames.b_proj_helper_user_rel);
  for (const [proj_id, names] of Object.entries(SEED.helpers)) {
    for (const helper of names) await helpersDB.insert({ proj_id, helper });
  }

  await clearDb(dbNames.a_comments);
  const now = Date.now();
  for (const [proj_id, list] of Object.entries(SEED.comments)) {
    for (let i = 0; i < list.length; i++) {
      await commentsDB.insert({
        proj_id,
        ...list[i],
        timestamp: now - (list.length - i) * 3600000,
      });
    }
  }

  return {
    success: true,
    garden: "seed-garden",
    projects: SEED.projects.map((p) => ({ _id: p._id, proj_name: p.proj_name })),
  };
}
