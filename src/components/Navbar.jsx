import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={{ padding: "15px", background: "#222" }}>
      <Link to="/" style={{ color: "white", marginRight: 15 }}>
        Home
      </Link>

      <Link to="/movies" style={{ color: "white", marginRight: 15 }}>
        Movies
      </Link>

      {user ? (
        <div style={{ display: "inline-block", marginLeft: "auto" }}>
          <span style={{ color: "white", marginRight: 15 }}>
            {user.displayName || user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
              marginRight: 15
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: "inline-block", marginLeft: "auto" }}>
          <Link to="/login" style={{ color: "white", marginRight: 15 }}>
            Login
          </Link>
          <Link to="/register" style={{ color: "white" }}>
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
