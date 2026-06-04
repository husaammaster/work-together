import { useEffect, useState } from "react";
import { Project } from "../types";

const apiBase = import.meta.env.VITE_API_BASE_URL;
const wsUrl = import.meta.env.VITE_WS_URL;

type ListMessage =
  | { type: "project_added"; payload: Project }
  | { type: "project_updated"; payload: Project }
  | { type: "project_deleted"; payload: { _id: string } }
  | { type: "counts_updated"; payload: { proj_id: string; helperCount: number; commentCount: number } };

/**
 * Live project list for the overview. Loads once over REST (each project comes
 * with its current helper/comment counts), then subscribes to the project-list
 * room so cards appear, update, disappear, and re-count in real time as anyone
 * adds/edits/deletes projects or joins/comments on them.
 *
 * `filter` mirrors the REST API: "" → all projects, otherwise projects by that user.
 */
export function useProjectList(filter: string = "") {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filter }),
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data: Project[] = await res.json();
        if (!cancelled) setProjects(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const socket = new WebSocket(wsUrl);
    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "subscribe_projects", payload: {} }));
    });
    socket.addEventListener("message", (event) => {
      let msg: ListMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      switch (msg.type) {
        case "project_added":
          // Respect the active owner filter for the "my projects" view.
          if (filter && msg.payload.nutzer !== filter) break;
          setProjects((prev) =>
            prev.some((p) => p._id === msg.payload._id) ? prev : [...prev, msg.payload],
          );
          break;
        case "project_updated":
          setProjects((prev) =>
            prev.map((p) =>
              p._id === msg.payload._id
                ? { ...msg.payload, helperCount: p.helperCount, commentCount: p.commentCount }
                : p,
            ),
          );
          break;
        case "project_deleted":
          setProjects((prev) => prev.filter((p) => p._id !== msg.payload._id));
          break;
        case "counts_updated":
          setProjects((prev) =>
            prev.map((p) =>
              p._id === msg.payload.proj_id
                ? { ...p, helperCount: msg.payload.helperCount, commentCount: msg.payload.commentCount }
                : p,
            ),
          );
          break;
      }
    });

    return () => {
      cancelled = true;
      socket.close();
    };
  }, [filter]);

  return { projects, loading, error };
}
