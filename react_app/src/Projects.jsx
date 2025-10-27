//  "nutzer": "Michael",
//  "proj_name": "Pflanzen im Park",
//  "description": "In den Martina Park gehen und zusammen Pflanzen pflanzen. \nIch brauche dafür sowohl Pflanzenspenden, als auch Helfer und Werkzeug (Schaufeln und Gartenhandschuhe)",
//  "maxHelpers": 4,
//  "items":

import { NavLink } from "react-router-dom";

export const ProjectCard = ({
  nutzer,
  proj_name,
  description,
  maxHelpers,
  items,
  proj_id,
}) => {
  return (
    <div className="bg-gray-800 m-7 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
      <div className="flex justify-between">
        <p>{nutzer}</p>
        <p>{maxHelpers} Helfer</p>
      </div>
      <NavLink to={`/project/${proj_id}`}>
        <h3 className="text-2xl font-bold mt-2">{proj_name}</h3>
      </NavLink>
      <p className="mb-4">{description}</p>
      <div className="space-y-2">
        <div className="space-y-1">
          <p className="font-semibold">Materialien:</p>
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ProjectPage = ({ project }) => {
  const {
    nutzer,
    proj_name,
    description,
    maxHelpers,
    items,
    _id: proj_id,
  } = project;

  console.log(project);
  console.log(`nutzer: ${nutzer}`);
  console.log(`proj_name: ${proj_name}`);
  console.log(`description: ${description}`);
  console.log(`maxHelpers: ${maxHelpers}`);
  console.log(`items: ${items}`);
  console.log(`proj_id: ${proj_id}`);
  return (
    <div
      id="project_page"
      className="text-inherit bg-inherit inherit text-white max-w-2xl mx-auto"
    >
      <div id="project_page__header" className="flex justify-between ">
        <NavLink to={`/project/${proj_id}`}>
          <h2 className="text-2xl font-bold" id="project_page__title">
            {proj_name}
          </h2>
        </NavLink>
        <div id="project_page__user">
          <p id="project_page__user__name">{nutzer}</p>
        </div>
      </div>
      <div id="project_page__description">
        <p>Beschreibung: {description}</p>
      </div>
      <div id="project_page__maxHelpers">
        <p>Anzahl gesuchter Helfer: {maxHelpers}</p>
      </div>
      <HelferListe proj_id={proj_id} />
      <MaterialListe items={items} />
      <KommentarListe proj_id={proj_id} />
    </div>
  );
};

const HelferListe = ({ proj_id }) => {
  return (
    <div id="project_page__helper-list">
      <h3 className="text-2xl font-bold">
        Helferliste Placeholder von {proj_id}
      </h3>
    </div>
  );
};

const MaterialListe = ({ items }) => {
  console.log(items);

  return (
    <div id="project_page__material-list">
      <h3 className="text-2xl font-bold">Materialien</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const KommentarListe = ({ proj_id }) => {
  return (
    <div id="project_page__comment-list">
      <h3 className="text-2xl font-bold">
        Kommentare Placeholde von {proj_id}
      </h3>
    </div>
  );
};
