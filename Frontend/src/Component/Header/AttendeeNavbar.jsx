import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice"; 
import { useNavigate } from "react-router-dom";

function AttendeeNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("attendee");
    navigate("/"); 
  };
  return (
    <div className="navbar bg-base-300 shadow-sm text-4xl">
      {/* Left Side */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-xl"
          >
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-2xl">
          EventConnect
        </Link>
      </div>

      {/* Middle */}
      <div className="navbar-center">
        <Link to="/update-profile" className="btn text-xl">
          Update Profile
        </Link>
      </div>

      {/* Right Side */}
      <div className="navbar-end">
        <button className="btn text-xl" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AttendeeNavbar;
