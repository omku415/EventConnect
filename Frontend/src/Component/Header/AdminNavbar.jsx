import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { useNavigate } from "react-router-dom";

function AdminNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div className="navbar bg-base-300 shadow-sm text-xl">
      {/* Left Side */}
      <div className="navbar-start">
        <div className="dropdown">
          <button
            className="btn btn-ghost lg:hidden"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>

          {mobileMenuOpen && (
            <ul className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow text-lg">
              <li>
                <Link to="/pending-managers" onClick={closeMobileMenu}>
                  Verify Manager
                </Link>
              </li>
              <li>
                <Link to="/verify-events" onClick={closeMobileMenu}>
                  Verify Events
                </Link>
              </li>
              <li>
                <Link to="/manage-user" onClick={closeMobileMenu}>
                  Manage User
                </Link>
              </li>
            </ul>
          )}
        </div>

        <Link to="/" className="btn btn-ghost text-2xl">
          EventConnect
        </Link>
      </div>

      {/* Middle - visible on large screens only */}
      <div className="navbar-center hidden lg:flex gap-4">
        <Link to="/pending-managers" className="btn btn-ghost text-lg">
          Verify Manager
        </Link>
        <Link to="/verify-events" className="btn btn-ghost text-lg">
          Verify Events
        </Link>
        <Link to="/manage-user" className="btn btn-ghost text-lg">
          Manage User
        </Link>
      </div>

      {/* Right Side */}
      <div className="navbar-end">
        <button className="btn text-lg" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminNavbar;
