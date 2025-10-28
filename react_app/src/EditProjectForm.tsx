import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "./hooks/redux";
import { Project } from "./types";

const apiBase = import.meta.env.VITE_API_BASE_URL;

/**
 * EditProjectForm component for editing existing projects
 * Only project owner can edit
 * Allows changing project owner (transfers ownership)
 */
export const EditProjectForm = () => {
  const navigate = useNavigate();
  const { proj_id } = useParams();
  const currentUser = useAppSelector((state) => state.user.name);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    proj_name: "",
    description: "",
    maxHelpers: 1,
    items: "",
    nutzer: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${apiBase}/project_page`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: proj_id }),
        });
        if (!response.ok) throw new Error("Failed to fetch project");
        const data: Project = await response.json();
        setProject(data);
        setFormData({
          proj_name: data.proj_name,
          description: data.description,
          maxHelpers: data.maxHelpers,
          items: data.items.join(", "),
          nutzer: data.nutzer,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    if (proj_id) fetchProject();
  }, [proj_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxHelpers" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    setSubmitting(true);
    setError(null);

    try {
      const itemsArray = formData.items
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const response = await fetch(`${apiBase}/update_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: project._id,
          _rev: project._rev,
          nutzer: formData.nutzer,
          proj_name: formData.proj_name,
          description: formData.description,
          maxHelpers: formData.maxHelpers,
          items: itemsArray,
        }),
      });

      if (!response.ok) throw new Error("Failed to update project");
      navigate(`/project/${project._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Loading project...</span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );

  if (!project || currentUser !== project.nutzer)
    return (
      <div className="alert alert-error">
        <span>Nur der Projektleiter kann dieses Projekt bearbeiten</span>
      </div>
    );

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body">
        <h2 className="card-title">Projekt bearbeiten</h2>
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Projektname</span>
            </label>
            <input
              type="text"
              name="proj_name"
              value={formData.proj_name}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Beschreibung</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full"
              rows={4}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Projektleiter (ändern übergibt Projekt)</span>
            </label>
            <input
              type="text"
              name="nutzer"
              value={formData.nutzer}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Maximale Anzahl Helfer</span>
            </label>
            <input
              type="number"
              name="maxHelpers"
              value={formData.maxHelpers}
              onChange={handleChange}
              min="1"
              required
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Materialien (komma-getrennt)</span>
            </label>
            <textarea
              name="items"
              value={formData.items}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary flex-1"
            >
              {submitting ? "Speichert..." : "Änderungen speichern"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/project/${project._id}`)}
              className="btn btn-outline flex-1"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
