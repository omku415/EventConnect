import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router";
import Footer from "./Component/Footer/Footer";
import MainNavbar from "./Component/Header/MainNavbar";
import AttendeeNavbar from "./Component/Header/AttendeeNavbar";
import AdminNavbar from "./Component/Header/AdminNavbar";
import ManagerNavbar from "./Component/Header/ManagerNavbar";
import { login } from "./Redux/authSlice"; // Adjust path if needed

function Layout() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Get userType from localStorage (assuming you set this in your login logic)
  const userType = localStorage.getItem("userType");
  const token = localStorage.getItem("token");

  // useEffect to load data from localStorage on first render
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedAttendee = localStorage.getItem("attendee");
    const storedManager = localStorage.getItem("manager");

    if (storedAdmin && storedAdmin !== "undefined") {
      dispatch(
        login({
          userType: "admin",
          userData: JSON.parse(storedAdmin),
          token,
        })
      );
    } else if (storedAttendee && storedAttendee !== "undefined") {
      dispatch(
        login({
          userType: "attendee",
          userData: JSON.parse(storedAttendee),
          token,
        })
      );
    } else if (storedManager && storedManager !== "undefined") {
      dispatch(
        login({
          userType: "manager",
          userData: JSON.parse(storedManager),
          token,
        })
      );
    }
  }, [dispatch, token]);

  // Conditionally render navbar based on userType
  let navbar = <MainNavbar />; // Default navbar if not logged in

  if (isLoggedIn) {
    switch (userType) {
      case "admin":
        navbar = <AdminNavbar />;
        break;
      case "attendee":
        navbar = <AttendeeNavbar />;
        break;
      case "manager":
        navbar = <ManagerNavbar />;
        break;
      default:
        navbar = <MainNavbar />;
    }
  }

  return (
    <>
      {navbar}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
