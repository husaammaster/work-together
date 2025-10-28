import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProjectCard, ProjectPage } from "./Projects.tsx";

const apiBase = import.meta.env.VITE_API_BASE_URL;
console.log(`Current vite api base url: ${apiBase}`);

export const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiBase}/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filter: "" }), // Empty filter to get all projects
        });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          nutzer={project.nutzer}
          proj_name={project.proj_name}
          description={project.description}
          maxHelpers={project.maxHelpers}
          items={project.items || []}
          _id={project._id}
        />
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
  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body">
        <p>placeholder for my projects page of: {nutzer}</p>
      </div>
    </div>
  );
};

export const ProjectsDetailPage = () => {
  const { proj_id } = useParams();
  const [fetchResult, setFetchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Projectk id _id ", proj_id);

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
