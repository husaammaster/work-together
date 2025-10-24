import { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import Project from './Projects';

const apiBase = import.meta.env.VITE_API_BASE_URL
console.log(`Current vite api base url: ${apiBase}`);


export const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${apiBase}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter: '' })  // Empty filter to get all projects
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

export const NotFoundPage = () => {
  return (
  <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
    404 - Page Not Found
    </p>
  )
};

export const MyProjectsPage = () => {
  const {nutzer} = useParams();
  return ( <p className="bg-gray-800 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
    placeholder for my projects page of: {nutzer}
  </p>
  )  
}