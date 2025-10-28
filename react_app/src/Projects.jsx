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
    <div className="card bg-base-200 shadow mb-4">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <p className="badge">{nutzer}</p>
          <p className="badge">{maxHelpers} Helfer</p>
        </div>
        <NavLink to={`/project/${proj_id}`}>
          <h3 className="card-title">{proj_name}</h3>
        </NavLink>
        <p className="">{description}</p>
        <div className="">
          <div className="">
            <p className="">Materialien:</p>
            <ul>
              {items.map((item, index) => (
                <li className="badge" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
    <div id="project_page" className="card bg-base-200 shadow">
      <div className="card-body">
        <div id="project_page__header" className="flex justify-between items-center">
          <NavLink to={`/project/${proj_id}`}>
            <h2 className="card-title" id="project_page__title">
              {proj_name}
            </h2>
          </NavLink>
          <div id="project_page__user">
            <p className="badge" id="project_page__user__name">
              {nutzer}
            </p>
          </div>
        </div>
        <div id="project_page__description">
          <p>Beschreibung: {description}</p>
        </div>
        <div id="project_page__maxHelpers">
          <p>Anzahl gesuchter Helfer: {maxHelpers}</p>
        </div>
        <div className="divider">Materialien</div>
        <MaterialListe items={items} />
        <div className="divider">Helfer</div>
        <HelferListe proj_id={proj_id} />
        <div className="divider">Kommentare</div>
        <KommentarListe proj_id={proj_id} />
      </div>
    </div>
  );
};

const HelferListe = ({ proj_id }) => {
  return (
    <div id="project_page__helper-list">
      <p>Helferliste Placeholder von {proj_id}</p>
    </div>
  );
};

const MaterialListe = ({ items }) => {
  console.log(items);

  return (
    <div id="project_page__material-list">
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span className="badge" key={index}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const KommentarListe = ({ proj_id }) => {
  return (
    <div id="project_page__comment-list">
      <p>Kommentare Placeholder von {proj_id}</p>
    </div>
  );
};
