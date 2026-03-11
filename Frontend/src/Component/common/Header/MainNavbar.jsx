import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function MainNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const hideLogin = location.pathname === "/login"; // hide login on login page

  return (
    <div className="navbar bg-base-300 shadow-sm text-4xl">
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
            <ul className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow text-xl">
              <li>
                <Link to="/about" onClick={closeMobileMenu}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeMobileMenu}>
                  Contact Us
                </Link>
              </li>
            </ul>
          )}
        </div>

        <Link to="/" className="btn btn-ghost text-2xl">
          EventConnect
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-xl">
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        {!hideLogin && (
          <Link to="/login" className="btn text-xl">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default MainNavbar;
