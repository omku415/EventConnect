import React from "react";

function Header() {
  return (
    <div className="navbar bg-base-300 shadow-sm text-4xl">
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
             className="menu  dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-xl">
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Contact Us</a>
            </li>
            <li>
              <a>Rate Us</a>
            </li>
       </ul>   
        </div>
        <a className="btn btn-ghost text-2xl">EventConnect</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-xl">
          <li>
            <a>About</a>
          </li>
          <li>
            <a>Contact Us</a>
          </li>
          <li>
            <a>Rate Us</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end ">
        <a className="btn text-xl">Login</a>
      </div>
    </div>
  );
}

export default Header;
