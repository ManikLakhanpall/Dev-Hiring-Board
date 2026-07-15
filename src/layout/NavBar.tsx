import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 bg-white border-b shadow-sm">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <NavLink
          to="/"
          className="text-2xl font-bold text-indigo-600 shrink-0"
        >
          🚀 DevBoard
        </NavLink>

        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/saved"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }
          >
            Saved
          </NavLink>

          <NavLink
            to="/applied"
            className={({ isActive }) =>
              isActive
                ? "font-semibold text-indigo-600"
                : "text-gray-600 hover:text-indigo-600"
            }
          >
            Applied
          </NavLink>
        </div>
      </nav>
    </header>
  );
}