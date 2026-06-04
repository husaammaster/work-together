import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProjectCard, ProjectPage } from "./Projects.tsx";
import { Project } from "./types";
import { AddProjectForm } from "./AddProjectForm";
import { EditProjectForm } from "./EditProjectForm";
import { useProjectList } from "./hooks/useProjectList";

const apiBase = import.meta.env.VITE_API_BASE_URL;
console.log(`Current vite api base url: ${apiBase}`);

export const ProjectListPage = () => {
  const { projects, loading, error } = useProjectList("");

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Loading projects...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );

  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </>
  );
};

export const NotFoundPage = () => {
  return (
    <div className="alert alert-warning">
      <span>404 - Page Not Found</span>
    </div>
  );
};

export const MyProjectsPage = () => {
  const { nutzer } = useParams();
  const { projects, loading, error } = useProjectList(nutzer || "");

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Loading projects...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Projekte von {nutzer}</h2>
      {projects.length === 0 ? (
        <div className="alert alert-info">
          <span>Keine Projekte gefunden</span>
        </div>
      ) : (
        projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))
      )}
    </>
  );
};

export const ProjectsDetailPage = () => {
  const { proj_id } = useParams();
  const [fetchResult, setFetchResult] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectById = async () => {
      try {
        const response = await fetch(`${apiBase}/project_page`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: proj_id }),
        });
        if (!response.ok)
          throw new Error(`Failed to fetch project by id ${proj_id}`);
        const data = await response.json();
        setFetchResult(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err)); // fallback for non-Error throws
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjectById();
  }, []);

  if (loading)
    return (
      <div className="alert alert-info">
        <span>Loading...</span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
      </div>
    );
  return <ProjectPage project={fetchResult} />;
};

export const AddProjectPage = () => {
  return <AddProjectForm />;
};

export const EditProjectPage = () => {
  return <EditProjectForm />;
};
