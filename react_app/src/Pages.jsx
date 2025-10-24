import Project from './Projects'

const apiBase = import.meta.env.VITE_API_BASE_URL;

export const ProjectList = () => {
    return (
        <>
            <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
            <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
            <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
            <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
        </>
    )
}