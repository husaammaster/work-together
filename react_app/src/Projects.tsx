import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Project } from "./types";
import { useAppSelector } from "./hooks/redux";
import { useProjectRoom } from "./hooks/useProjectChat";
import { helperBadgeColor } from "./lib/helperBadge";

type Room = ReturnType<typeof useProjectRoom>;

export const ProjectCard = ({ project }: { project: Project }) => {
  const {
    _id,
    nutzer,
    proj_name,
    description,
    maxHelpers,
    items,
    helperCount = 0,
    commentCount = 0,
  } = project;

  // The whole card is the link to the detail page (it has no nested buttons,
  // so there's nothing to overlap).
  return (
    <NavLink
      to={`/project/${_id}`}
      className="card bg-base-200 shadow mb-4 block transition-shadow hover:shadow-lg"
    >
      <div className="card-body">
        <div className="flex justify-between items-center gap-2">
          <span className="badge badge-neutral">{nutzer}</span>
          <div className="flex items-center gap-2">
            <span
              className={`badge ${helperBadgeColor(helperCount, maxHelpers)}`}
              title="Helfer / gesucht"
            >
              {helperCount}/{maxHelpers} Helfer
            </span>
            <span className="badge badge-ghost" title="Kommentare">
              💬 {commentCount}
            </span>
          </div>
        </div>
        <h3 className="card-title">{proj_name}</h3>
        <p>{description}</p>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {items.map((item, index) => (
              <span className="badge badge-outline" key={index}>
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </NavLink>
  );
};

export const ProjectPage = ({ project }: { project: Project | null }) => {
  const currentUser = useAppSelector((state) => state.user.name);
  const navigate = useNavigate();
  // Hook is called unconditionally (rules of hooks); "" is harmless when the
  // project failed to load and we early-return below.
  const room = useProjectRoom(project?._id ?? "");

  if (!project)
    return <div className="alert alert-error">Projekt nicht gefunden</div>;

  const { nutzer, proj_name, description, maxHelpers, items, _id, _rev } = project;
  const isOwner = currentUser === nutzer;

  // The project was deleted (by anyone) while this page was open.
  if (room.deleted) {
    return (
      <div className="card bg-base-200 shadow">
        <div className="card-body items-center text-center gap-3">
          <h2 className="card-title">Projekt wurde gelöscht</h2>
          <p className="opacity-70">
            Dieses Projekt wurde inzwischen entfernt und ist nicht mehr verfügbar.
          </p>
          <NavLink to="/" className="btn btn-primary btn-sm">
            Zur Übersicht
          </NavLink>
        </div>
      </div>
    );
  }

  const handleDeleteProject = () => {
    if (!window.confirm("Wirklich löschen?")) return;
    room.deleteProject(_rev);
    navigate("/");
  };

  return (
    <div id="project_page" className="card bg-base-200 shadow">
      <div className="card-body">
        <div
          id="project_page__header"
          className="flex justify-between items-center gap-2"
        >
          <div>
            <h2 className="card-title" id="project_page__title">
              {proj_name}
            </h2>
            <p className="text-sm opacity-70">von {nutzer}</p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <NavLink to={`/project/${_id}/edit`}>
                <button className="btn btn-sm btn-outline">Bearbeiten</button>
              </NavLink>
              <button
                onClick={handleDeleteProject}
                className="btn btn-sm btn-outline btn-error"
              >
                Löschen
              </button>
            </div>
          )}
        </div>
        <div id="project_page__description">
          <p>{description}</p>
        </div>
        <div id="project_page__maxHelpers">
          <p className="text-sm">Gesucht: {maxHelpers} Helfer</p>
        </div>
        <div className="divider">Materialien</div>
        <MaterialListe items={items} />
        <div className="divider">Helfer</div>
        <HelferListe
          room={room}
          maxHelpers={maxHelpers}
          isOwner={isOwner}
          currentUser={currentUser}
        />
        <div className="divider">Kommentare</div>
        <KommentarListe room={room} projectOwner={nutzer} currentUser={currentUser} />
      </div>
    </div>
  );
};

const HelferListe = ({
  room,
  maxHelpers,
  isOwner,
  currentUser,
}: {
  room: Room;
  maxHelpers: number;
  isOwner: boolean;
  currentUser: string;
}) => {
  const { helpers, loading, error } = room;

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Helfer werden geladen...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );

  const helperCount = helpers.length;
  const isUserHelper = helpers.includes(currentUser);

  return (
    <div id="project_page__helper-list">
      <div className="flex items-center gap-2 mb-4">
        <span className={`badge ${helperBadgeColor(helperCount, maxHelpers)}`}>
          {helperCount}/{maxHelpers} Helfer
        </span>
      </div>
      <ul className="space-y-2">
        {helpers.map((helper) => (
          <li key={helper} className="flex items-center justify-between">
            <span>{helper}</span>
            {/* A helper can leave; the owner can remove anyone. */}
            {(helper === currentUser || isOwner) && (
              <button
                onClick={() => room.removeHelper(helper)}
                className="btn btn-sm btn-outline btn-error"
              >
                {helper === currentUser ? "Verlassen" : "Entfernen"}
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isOwner && !isUserHelper && (
        <button
          onClick={() => room.joinProject(currentUser)}
          className="btn btn-sm btn-primary mt-4"
        >
          Beitreten
        </button>
      )}
    </div>
  );
};

const MaterialListe = ({ items }: { items: string[] }) => {
  return (
    <div id="project_page__material-list">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span className="badge" key={index}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const KommentarListe = ({
  room,
  projectOwner,
  currentUser,
}: {
  room: Room;
  projectOwner: string;
  currentUser: string;
}) => {
  const { comments, loading, error, connected, addComment, deleteComment } = room;
  const [newComment, setNewComment] = useState<string>("");

  const sortedComments = [...comments].sort(
    (a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0),
  );

  const handleAddComment = () => {
    addComment(newComment, currentUser);
    setNewComment("");
  };

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Kommentare werden geladen...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );

  return (
    <div id="project_page__comment-list">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge badge-sm">{comments.length} Kommentare</span>
        <span
          className={`badge badge-sm gap-1 ${connected ? "badge-success" : "badge-ghost"}`}
          title={connected ? "Live über WebSocket verbunden" : "Verbinde..."}
        >
          <span
            className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-current animate-pulse" : "bg-current opacity-50"}`}
          />
          {connected ? "Live" : "Offline"}
        </span>
      </div>
      <div className="space-y-3">
        {sortedComments.map((comment) => (
          <div key={comment._id} className="card bg-base-100 shadow-sm">
            <div className="card-body p-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{comment.user}</p>
                    {comment.user === projectOwner && (
                      <span className="badge badge-sm">Projektleiter</span>
                    )}
                  </div>
                  {comment.timestamp && (
                    <p className="text-xs opacity-50">
                      {new Date(comment.timestamp).toLocaleString("de-DE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
                {comment.user === currentUser && (
                  <button
                    onClick={() => deleteComment(comment)}
                    className="btn btn-xs btn-ghost btn-error"
                  >
                    Löschen
                  </button>
                )}
              </div>
              <p className="text-sm mt-2">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Kommentar schreiben..."
          className="textarea textarea-bordered w-full"
          rows={3}
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className="btn btn-sm btn-primary w-full"
        >
          Kommentar hinzufügen
        </button>
      </div>
    </div>
  );
};
