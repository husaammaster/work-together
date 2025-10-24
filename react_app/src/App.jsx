import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Project from './Projects'

const App = () => {
  return (
    <div className="dark:bg-gray-900">
      <Header />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} className="dark:border-gray-700 dark:bg-gray-800" />
    </div>
  )
}

const Header = () => {
  return (
    <div className="backdrop-blur-2xl max-w-2xl mx-auto bg-blue-900/50 p-3 text-white sticky top-0 z-10 flex items-start justify-between">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl font-bold">Work Together</h1>
        <p>Find projects you want to support</p>
      </div>
      <div className=" flex flex-col space-y-2">
        <label htmlFor="user" className="text-sm font-medium">User</label>
        <input id="user" type="text" placeholder="Name" className="text-sm border border-gray-600 rounded-md " />
      </div>
    </div>
  )
} 

export default App
