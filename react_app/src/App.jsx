import './App.css'
import {Route, Routes, Outlet, NavLink} from 'react-router-dom'
import {ProjectListPage, MyProjectsPage, NotFoundPage} from './Pages'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/userSlice.js';

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
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.name);

  const handleUserChange = (evnt) => {
    dispatch(setUser(evnt.target.value));
  };

  return (
    <>
      <div className="backdrop-blur-2xl max-w-2xl mx-auto bg-blue-900/50 p-3 text-white sticky top-0 z-10 flex items-start justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl font-bold">Work Together</h1>
          <p>Find projects you want to support</p>
        </div>
        <div className=" flex flex-col space-y-2">
          <label htmlFor="user" className="text-sm font-medium">Eingeloggt als </label>
          <input id="user" type="text" value={user} onChange={handleUserChange}
            className="text-sm border border-gray-600 rounded-md "
          />
        </div>
      </div>
      <Navbar />
    </>
  )
} 

const Navbar = () => {
  const user = useSelector(state => state.user.name);

  return (
    <nav className="backdrop-blur-2xl max-w-2xl mx-auto bg-blue-900/50 p-3 text-white sticky top-21 z-10 flex items-start justify-between">
      <NavLink className="p-2 badge" to="/">Home</NavLink>
      <NavLink className="p-2 badge" to="/my_projects/Alex">Alex's Projekte</NavLink>
      <NavLink className="p-2 badge" to={`/my_projects/${user}`}>Meine eigenen Projekte</NavLink>
    </nav>
  )

}

const Footer = () => {
  return (
    <p className='text-center text-white dark:bg-gray-800 p-3 mb-0'>
      Copyright Helpers Inc. 2025
    </p>
  )
}


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </> 
  )
}
export default App
