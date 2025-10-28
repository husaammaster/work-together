import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
const apiBase = import.meta.env.VITE_API_BASE_URL;

import { Project, Comment, Helper, HelperListResponse } from "./types";
import { useAppSelector } from "./hooks/redux";

export const ProjectCard = ({
  nutzer,
  proj_name,
  description,
  maxHelpers,
  items,
  _id,
}: Project) => {
  console.log("ProjectCard proj_id", _id);
  return (
    <div className="card bg-base-200 shadow mb-4">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <p className="badge">{nutzer}</p>
          <p className="badge">{maxHelpers} Helfer</p>
        </div>
        <NavLink to={`/project/${_id}`}>
          <h3 className="card-title">{proj_name}</h3>
        </NavLink>
        <p className="">{description}</p>
        <div className="">
          <div className="">
            <p className="">Materialien:</p>
            <ul>
              {items.map((item, index) => (
                <li className="badge" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProjectPage = ({ project }: { project: Project | null }) => {
  const currentUser = useAppSelector((state) => state.user.name);

  if (!project)
    return <div className="alert alert-error">Projekt nicht gefunden</div>;

  const { nutzer, proj_name, description, maxHelpers, items, _id, _rev } = project;
  const isOwner = currentUser === nutzer;

  const handleDeleteProject = async () => {
    if (!window.confirm("Wirklich löschen?")) return;
    try {
      await fetch(`${apiBase}/delete_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, _rev }),
      });
      window.location.href = "/";
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div id="project_page" className="card bg-base-200 shadow">
      <div className="card-body">
        <div
          id="project_page__header"
          className="flex justify-between items-center gap-2"
        >
          <div>
            <NavLink to={`/project/${_id}`}>
              <h2 className="card-title" id="project_page__title">
                {proj_name}
              </h2>
            </NavLink>
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
        <HelferListe proj_id={_id} isOwner={isOwner} />
        <div className="divider">Kommentare</div>
        <KommentarListe proj_id={_id} projectOwner={nutzer} />
      </div>
    </div>
  );
};

const HelferListe = ({ proj_id, isOwner }: { proj_id: string; isOwner: boolean }) => {
  const currentUser = useAppSelector((state) => state.user.name);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [helperCount, setHelperCount] = useState<number>(0);

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const response = await fetch(`${apiBase}/helper_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proj_id }),
        });
        if (!response.ok) throw new Error("Failed to fetch helpers");
        const data: HelperListResponse = await response.json();
        setHelpers(data.docs);
        setHelperCount(data.docs.length);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHelpers();
  }, [proj_id]);

  const handleJoinProject = async () => {
    try {
      await fetch(`${apiBase}/join_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proj_id, nutzer: currentUser }),
      });
      setHelpers([...helpers, { _id: "", proj_id, helper: currentUser }]);
      setHelperCount(helperCount + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleLeaveProject = async () => {
    try {
      await fetch(`${apiBase}/leave_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proj_id, nutzer: currentUser }),
      });
      setHelpers(helpers.filter((h) => h.helper !== currentUser));
      setHelperCount(helperCount - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Loading helpers...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );

  const isUserHelper = helpers.some((h) => h.helper === currentUser);
  const helperColor =
    helperCount === 0
      ? "badge-error"
      : helperCount < 2
        ? "badge-warning"
        : "badge-success";

  return (
    <div id="project_page__helper-list">
      <div className="flex items-center gap-2 mb-4">
        <span className={`badge ${helperColor}`}>
          {helperCount} Helfer
        </span>
      </div>
      <ul className="space-y-2">
        {helpers.map((helper) => (
          <li key={helper._id} className="flex items-center justify-between">
            <span>{helper.helper}</span>
            {isUserHelper && helper.helper === currentUser && (
              <button
                onClick={handleLeaveProject}
                className="btn btn-sm btn-outline btn-error"
              >
                Verlassen
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isOwner && !isUserHelper && (
        <button
          onClick={handleJoinProject}
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

const KommentarListe = ({ proj_id, projectOwner }: { proj_id: string; projectOwner: string }) => {
  const currentUser = useAppSelector((state) => state.user.name);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${apiBase}/comment_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proj_id }),
        });
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data = await response.json();
        setComments(data.docs);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [proj_id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await fetch(`${apiBase}/new_comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proj_id,
          comment: newComment,
          user: currentUser,
          timestamp: Date.now(),
        }),
      });
      setNewComment("");
      const response = await fetch(`${apiBase}/comment_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proj_id }),
      });
      const data = await response.json();
      setComments(data.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteComment = async (commentId: string, commentRev: string | undefined) => {
    if (!commentRev) return;
    try {
      await fetch(`${apiBase}/delete_comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: commentId, _rev: commentRev }),
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Loading comments...</span>
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
      <div className="space-y-3">
        {comments.map((comment) => (
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
                    onClick={() => handleDeleteComment(comment._id, comment._rev)}
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
