
//   "nutzer": "Michael",
//  "proj_name": "Pflanzen im Park",
//  "description": "In den Martina Park gehen und zusammen Pflanzen pflanzen. \nIch brauche dafür sowohl Pflanzenspenden, als auch Helfer und Werkzeug (Schaufeln und Gartenhandschuhe)",
//  "maxHelpers": 4,
//  "items":

const Project = ({nutzer, proj_name, description, maxHelpers, items}) => {
  return (
    <div className="bg-gray-800 m-7 shadow-md rounded-lg p-4 mx-auto max-w-2xl text-white">
      <div className="flex justify-between">
        <p>{nutzer}</p>
        <p>{maxHelpers} Helfer</p>
      </div>
      <h3 className="text-2xl font-bold mt-2">{proj_name}</h3>
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
  )
}


export default Project