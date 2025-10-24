import { useState, useEffect } from 'react';
import Project from './Projects';

const apiBase = import.meta.env.VITE_API_BASE_URL

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiBase}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter: '' })  // Empty filter for all projects
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
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

  if (loading) return <p className='bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white'>
    Loading projects...
    </p>;
  if (error) return <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
    Error: {error}
    </p>;

  return (
    <>
      {projects.map((project, index) => (
        <Project
          key={index}
          nutzer={project.nutzer}
          proj_name={project.proj_name}
          description={project.description}
          maxHelpers={project.maxHelpers}
          items={project.items || []}
        />
      ))}
    </>
  );
};