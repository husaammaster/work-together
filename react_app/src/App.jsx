import "./App.css";
import { useEffect } from "react";
import { Route, Routes, Outlet, NavLink } from "react-router-dom";
import {
  ProjectListPage,
  ProjectsDetailPage,
  MyProjectsPage,
  NotFoundPage,
} from "./Pages";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./features/userSlice.js";

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProjectListPage />} />
          <Route path="/my_projects/:nutzer" element={<MyProjectsPage />} />
          <Route path="/project/:proj_id" element={<ProjectsDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.name);

  const handleUserChange = (evnt) => {
    dispatch(setUser(evnt.target.value));
  };

  return (
    <>
      <div className="navbar bg-base-200 sticky top-0 z-10 shadow">
        <div className="navbar-start">
          <div className="">
            <h1 className="text-xl font-bold">Work Together</h1>
            <p className="text-sm opacity-70">
              Find projects you want to support
            </p>
          </div>
        </div>
        <div className="navbar-end gap-2">
          <label htmlFor="user" className="text-sm">
            Eingeloggt als
          </label>
          <input
            id="user"
            type="text"
            value={user}
            onChange={handleUserChange}
            className="input input-bordered input-sm w-40"
          />
        </div>
      </div>
      <Navbar />
    </>
  );
};

const Navbar = () => {
  const user = useSelector((state) => state.user.name);

  return (
    <nav className="bg-base-300 shadow">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 p-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "btn btn-ghost btn-sm btn-active"
              : "btn btn-ghost btn-sm"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/my_projects/Alex"
          className={({ isActive }) =>
            isActive
              ? "btn btn-ghost btn-sm btn-active"
              : "btn btn-ghost btn-sm"
          }
        >
          Alex's Projekte
        </NavLink>
        <NavLink
          to={`/my_projects/${user}`}
          className={({ isActive }) =>
            isActive
              ? "btn btn-ghost btn-sm btn-active"
              : "btn btn-ghost btn-sm"
          }
        >
          Meine eigenen Projekte
        </NavLink>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <div className="footer footer-center bg-base-200 text-base-content p-4 mt-10">
      <p>Copyright Helpers Inc. 2025</p>
    </div>
  );
};

const Layout = () => {
  useEffect(() => {
    const themes = [
      "cupcake",
      "dracula",
      "synthwave",
      "halloween",
      "cyberpunk",
      "forest",
      "aqua",
      "luxury",
      "pastel",
      "emerald",
    ];
    const htmlEl = document.documentElement;
    const current = htmlEl.getAttribute("data-theme");
    let idx = Math.max(0, themes.indexOf(current));
    const timer = setInterval(() => {
      idx = (idx + 1) % themes.length;
      htmlEl.setAttribute("data-theme", themes[idx]);
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default App;
