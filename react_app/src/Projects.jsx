
//   "nutzer": "Michael",
//  "proj_name": "Pflanzen im Park",
//  "description": "In den Martina Park gehen und zusammen Pflanzen pflanzen. \nIch brauche dafür sowohl Pflanzenspenden, als auch Helfer und Werkzeug (Schaufeln und Gartenhandschuhe)",
//  "maxHelpers": 4,
//  "items":

const Project = ({nutzer, proj_name, description, maxHelpers, items}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">{nutzer}</p>
        <p className="text-gray-600">{maxHelpers} Helfer</p>
      </div>
      <h3 className="text-2xl font-bold mt-2">{proj_name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <p className="text-gray-600 font-semibold">Materialien:</p>
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={index} className="text-gray-600">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}


export default Project