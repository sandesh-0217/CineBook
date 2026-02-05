import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const linkClasses = (path) =>
    `px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition ${
      location.pathname === path ? "bg-blue-600 text-white" : "text-gray-800"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return "U";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">CineBook</Link>
        </div>

        {/* Links */}
        <div className="flex items-center space-x-2">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link to="/movies" className={linkClasses("/movies")}>
            Movies
          </Link>
          {user && (
            <Link to="/bookings" className={linkClasses("/bookings")}>
              My Bookings
            </Link>
          )}

          {user ? (
            // User is logged in - show profile
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 transition text-gray-800"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {getInitials(user.displayName || user.email)}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[100px] truncate">
                  {user.displayName || user.email}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // User is not logged in - show login/signup
            <>
              <Link to="/login" className={linkClasses("/login")}>
                Login
              </Link>
              <Link to="/register" className={linkClasses("/register")}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
