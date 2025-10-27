import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProjectCard, ProjectPage } from "./Projects";

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
      <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
        Loading projects...
      </p>
    );
  if (error)
    return (
      <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
        Error: {error}
      </p>
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
          proj_id={project._id}
        />
      ))}
    </>
  );
};

export const NotFoundPage = () => {
  return (
    <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
      404 - Page Not Found
    </p>
  );
};

export const MyProjectsPage = () => {
  const { nutzer } = useParams();
  return (
    <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
      placeholder for my projects page of: {nutzer}
    </p>
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
      } catch {
        setError("Failed to fetch project by id");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectById();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ProjectPage project={fetchResult} />;
};
