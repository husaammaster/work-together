import { useCallback, useEffect, useRef, useState } from "react";
import { Comment, CommentListResponse } from "../types";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

type ServerMessage =
  | { type: "comment_added"; payload: Comment }
  | { type: "comment_deleted"; payload: { _id: string; proj_id: string } };

/**
 * Owns the comment list for a single project as a live chat.
 *
 * Initial history is loaded once over REST (`/comment_list`); from then on the
 * list is driven entirely by the WebSocket server: posting and deleting are
 * sent as WS messages and the resulting `comment_added` / `comment_deleted`
 * broadcasts update the list — so every open project page stays in sync in
 * real time, without polling.
 */
export function useProjectChat(proj_id: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;

    // 1. Load existing comments once via REST.
    (async () => {
      try {
        const response = await fetch(`${apiBase}/comment_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proj_id }),
        });
        if (!response.ok) throw new Error("Failed to fetch comments");
        const data: CommentListResponse = await response.json();
        if (!cancelled) setComments(data.docs ?? []);
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
      if (msg.type === "comment_added" && msg.payload.proj_id === proj_id) {
        setComments((prev) =>
          prev.some((c) => c._id === msg.payload._id)
            ? prev
            : [...prev, msg.payload],
        );
      } else if (msg.type === "comment_deleted") {
        setComments((prev) => prev.filter((c) => c._id !== msg.payload._id));
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
      send({
        type: "new_comment",
        payload: { proj_id, comment: trimmed, user, timestamp: Date.now() },
      });
    },
    [proj_id, send],
  );

  const deleteComment = useCallback(
    (comment: Comment) => {
      send({
        type: "delete_comment",
        payload: { _id: comment._id, _rev: comment._rev, proj_id },
      });
    },
    [proj_id, send],
  );

  return { comments, loading, error, connected, addComment, deleteComment };
}
