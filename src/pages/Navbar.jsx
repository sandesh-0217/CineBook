import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation(); // to highlight active link

  const linkClasses = (path) =>
    `px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition ${
      location.pathname === path ? "bg-blue-600 text-white" : "text-gray-800"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
          <Link to="/">CineBook</Link>
        </div>

        {/* Links */}
        <div className="flex space-x-2">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link to="/movies" className={linkClasses("/movies")}>
            Movies
          </Link>
          <Link to="/bookings" className={linkClasses("/bookings")}>
            My Bookings
          </Link>
          <Link to="/login" className={linkClasses("/login")}>
            Login
          </Link>
          <Link to="/register" className={linkClasses("/register")}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
