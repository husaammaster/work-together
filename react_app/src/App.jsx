import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Project from './Projects'

const App = () => {
  return (
    <div>
      <h1>Functional Arrow Component</h1>
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} />
      <Project nutzer="Michael" proj_name="Pflanzen im Park" description="In den Martina Park gehen" maxHelpers={4} items={["Schaufeln", "Gartenhandschuhe"]} />
    </div>
  )
}
export default App
