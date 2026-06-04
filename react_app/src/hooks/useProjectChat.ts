import { useCallback, useEffect, useRef, useState } from "react";
import { Comment, CommentListResponse, Helper, HelperListResponse } from "../types";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

type ServerMessage =
  | { type: "comment_added"; payload: Comment }
  | { type: "comment_deleted"; payload: { _id: string; proj_id: string } }
  | { type: "helper_added"; payload: { proj_id: string; helper: string } }
  | { type: "helper_removed"; payload: { proj_id: string; helper: string } }
  | { type: "project_deleted"; payload: { _id: string } };

/**
 * Owns the live state of a single project's page over one WebSocket connection:
 * the comment thread AND the helper list, plus a `deleted` flag if the project
 * is removed while the page is open.
 *
 * Initial state is loaded once over REST; from then on everything is driven by
 * WebSocket broadcasts (comments, helpers join/leave/remove, deletion), and all
 * mutations are sent as WS messages — so every open copy of the page stays in
 * sync in real time without polling.
 */
export function useProjectRoom(proj_id: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [helpers, setHelpers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    // 1. Load existing comments + helpers once via REST.
    (async () => {
      try {
        const [cRes, hRes] = await Promise.all([
          fetch(`${apiBase}/comment_list`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ proj_id }),
          }),
          fetch(`${apiBase}/helper_list`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ proj_id }),
          }),
        ]);
        if (!cRes.ok || !hRes.ok) throw new Error("Failed to load project");
        const cData: CommentListResponse = await cRes.json();
        const hData: HelperListResponse = await hRes.json();
        if (!cancelled) {
          setComments(cData.docs ?? []);
          setHelpers((hData.docs ?? []).map((h: Helper) => h.helper));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    // 2. Open the live channel and join this project's room.
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      setConnected(true);
      socket.send(JSON.stringify({ type: "subscribe", payload: { proj_id } }));
    });
    socket.addEventListener("close", () => setConnected(false));

    socket.addEventListener("message", (event) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      switch (msg.type) {
        case "comment_added":
          if (msg.payload.proj_id === proj_id) {
            setComments((prev) =>
              prev.some((c) => c._id === msg.payload._id) ? prev : [...prev, msg.payload],
            );
          }
          break;
        case "comment_deleted":
          setComments((prev) => prev.filter((c) => c._id !== msg.payload._id));
          break;
        case "helper_added":
          if (msg.payload.proj_id === proj_id) {
            setHelpers((prev) =>
              prev.includes(msg.payload.helper) ? prev : [...prev, msg.payload.helper],
            );
          }
          break;
        case "helper_removed":
          if (msg.payload.proj_id === proj_id) {
            setHelpers((prev) => prev.filter((h) => h !== msg.payload.helper));
          }
          break;
        case "project_deleted":
          if (msg.payload._id === proj_id) setDeleted(true);
          break;
      }
    });

    return () => {
      cancelled = true;
      socket.close();
      socketRef.current = null;
    };
  }, [proj_id]);

  const send = useCallback((data: unknown) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  }, []);

  const addComment = useCallback(
    (text: string, user: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      send({ type: "new_comment", payload: { proj_id, comment: trimmed, user, timestamp: Date.now() } });
    },
    [proj_id, send],
  );

  const deleteComment = useCallback(
    (comment: Comment) => {
      send({ type: "delete_comment", payload: { _id: comment._id, _rev: comment._rev, proj_id } });
    },
    [proj_id, send],
  );

  const joinProject = useCallback(
    (user: string) => send({ type: "join_project", payload: { proj_id, helper: user } }),
    [proj_id, send],
  );

  // Used both for "leave" (a helper removes themselves) and for the owner
  // removing someone — same operation, keyed by helper name.
  const removeHelper = useCallback(
    (helper: string) => send({ type: "leave_project", payload: { proj_id, helper } }),
    [proj_id, send],
  );

  const deleteProject = useCallback(
    (rev: string | undefined) => send({ type: "delete_project", payload: { _id: proj_id, _rev: rev } }),
    [proj_id, send],
  );

  return {
    comments,
    helpers,
    loading,
    error,
    connected,
    deleted,
    addComment,
    deleteComment,
    joinProject,
    removeHelper,
    deleteProject,
  };
}
