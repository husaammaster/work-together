import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./hooks/redux";

const apiBase = import.meta.env.VITE_API_BASE_URL;

/**
 * AddProjectForm component for creating new projects
 * Handles form submission and redirects to project detail page on success
 */
export const AddProjectForm = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.user.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    proj_name: "",
    description: "",
    maxHelpers: 1,
    items: "",
  });

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
    setLoading(true);
    setError(null);

    try {
      const itemsArray = formData.items
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const response = await fetch(`${apiBase}/new_project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nutzer: currentUser,
          proj_name: formData.proj_name,
          description: formData.description,
          maxHelpers: formData.maxHelpers,
          items: itemsArray,
        }),
      });

      if (!response.ok) throw new Error("Failed to create project");
      const project = await response.json();
      navigate(`/project/${project._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body">
        <h2 className="card-title">Neues Projekt erstellen</h2>
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
              placeholder="z.B. Pflanzen im Park"
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
              placeholder="Beschreibe dein Projekt..."
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
              placeholder="z.B. Schaufeln, Gartenhandschuhe, Pflanzen"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Erstelle..." : "Projekt erstellen"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
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
