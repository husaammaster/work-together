import './App.css'
import {Route, Routes, Outlet, NavLink} from 'react-router-dom'
import {ProjectListPage, MyProjectsPage, NotFoundPage} from './Pages'

const App = () => {
  return (
    <div className="dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProjectListPage />} />
          <Route path="/my_projects/:nutzer" element={<MyProjectsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  )
}

const Header = () => {
  return (
    <>
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
      <Navbar />
    </>
  )
} 

const Navbar = () => {
  const user = 'martina';
  return (
    <nav className="backdrop-blur-2xl max-w-2xl mx-auto bg-blue-900/50 p-3 text-white sticky top-21 z-10 flex items-start justify-between">
      <NavLink className="p-2 badge" to="/">Home</NavLink>
      <NavLink className="p-2 badge" to="/my_projects/alex">Alex's Projekte</NavLink>
      <NavLink className="p-2 badge" to={`/my_projects/${user}`}>Martina's Projekte</NavLink>
    </nav>
  )

}

const Footer = () => {
  return (
    <p>
      Copyright Helpers Inc. 2025
    </p>
  )
}


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />/
    </> 
  )
}
export default App
