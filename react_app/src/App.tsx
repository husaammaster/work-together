import "./App.css";
import { useEffect } from "react";
import { Route, Routes, Outlet, NavLink } from "react-router-dom";
import {
  ProjectListPage,
  ProjectsDetailPage,
  MyProjectsPage,
  NotFoundPage,
  AddProjectPage,
  EditProjectPage,
} from "./Pages.tsx";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { setUser } from "./features/userSlice";

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ProjectListPage />} />
          <Route path="/my_projects/:nutzer" element={<MyProjectsPage />} />
          <Route path="/project/:proj_id" element={<ProjectsDetailPage />} />
          <Route path="/project/:proj_id/edit" element={<EditProjectPage />} />
          <Route path="/new_project" element={<AddProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </div>
  );
};

const Header = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);

  const handleUserChange = (evnt: React.ChangeEvent<HTMLInputElement>) => {
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
  const user = useAppSelector((state) => state.user.name);

  return (
    <nav className="bg-base-300 shadow">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 p-2">
        <div className="flex items-center gap-2">
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
            Meine Projekte
          </NavLink>
        </div>
        <NavLink
          to="/new_project"
          className={({ isActive }) =>
            isActive
              ? "btn btn-primary btn-sm btn-outline"
              : "btn btn-primary btn-sm"
          }
        >
          + Neues Projekt
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
    const themes: string[] = [
      "cupcake",
      "dracula",
      "forest",
      "aqua",
      "luxury",
      "pastel",
      "emerald",
    ];
    const htmlEl = document.documentElement;
    const current: string | null = htmlEl.getAttribute("data-theme");
    console.log(`[Theme] current: ${current || "(none)"}`);
    let idx: number = Math.max(0, themes.indexOf(current || ""));
    const timer = setInterval(() => {
      idx = (idx + 1) % themes.length;
      htmlEl.setAttribute("data-theme", themes[idx] || "light");
      console.log(`[Theme] switched to: ${themes[idx]}`);
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
