import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown, Lightbulb, Shield } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) =>
    `transition-colors ${isActive(path) ? "text-primary font-bold" : "text-gray-700 dark:text-gray-200 hover:text-primary"}`;

  const mobileNavLinkClass = (path) =>
    `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(path) ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"}`;

  const handleLogout = () => {
    logout();
    navigate("/");
    setProfileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">IdeaVault</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/ideas" className={navLinkClass("/ideas")}>
              Ideas
            </Link>
            {user ? (
              <div className="md:flex gap-6">
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  Dashboard
                </Link>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <img
                    src={user.photo || `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                  />
                  <span className="text-gray-700 dark:text-gray-200 hidden sm:block font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4 text-primary" /> Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Shield className="w-4 h-4 text-primary" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark shadow-sm transition-all hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1">
            <Link to="/" className={mobileNavLinkClass("/")} onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link
              to="/ideas"
              className={mobileNavLinkClass("/ideas")}
              onClick={() => setMobileOpen(false)}
            >
              Ideas
            </Link>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={mobileNavLinkClass("/admin/dashboard")}
                    onClick={() => setMobileOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={mobileNavLinkClass("/dashboard")}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2 px-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="block text-center px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-primary font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-3 bg-primary text-white font-medium rounded-xl shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
