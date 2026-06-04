import "./App.css";
import { useEffect, useState } from "react";
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

const THEMES = [
  "emerald",
  "light",
  "dark",
  "cupcake",
  "dracula",
  "forest",
  "aqua",
  "luxury",
  "pastel",
  "synthwave",
  "cyberpunk",
  "halloween",
];

const Header = ({
  theme,
  onThemeChange,
}: {
  theme: string;
  onThemeChange: (theme: string) => void;
}) => {
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
          <label htmlFor="theme" className="text-sm">
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="select select-bordered select-sm w-32"
          >
            {THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("theme") || "emerald",
  );

  useEffect(() => {
    // Set default random user if not already set
    if (!user) {
      const defaultUsers: string[] = [
        "Kevin",
        "Badr",
        "Omar",
        "Saleh",
        "Ahmad",
        "Marie",
        "Leon",
        "Alex",
        "Jonas",
        "Muhammad",
        "Michael",
        "Sarah",
        "David",
        "Fatima",
        "Noah",
        "Miriam",
        "Adam",
        "Leah",
        "Ibrahim",
        "Hannah",
        "Samuel",
      ];
      const randomUser: string =
        defaultUsers[Math.floor(Math.random() * defaultUsers.length)] || "Alex";
      dispatch(setUser(randomUser));
    }
  }, []);

  // Apply the chosen theme and remember it (no more auto-rotation).
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <Header theme={theme} onThemeChange={setTheme} />
      <main className="max-w-3xl mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default App;
