import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router";
import Footer from "./Component/Footer/Footer";
import MainNavbar from "./Component/Header/MainNavbar";
import AttendeeNavbar from "./Component/Header/AttendeeNavbar";
import AdminNavbar from "./Component/Header/AdminNavbar";
import { login } from "./Redux/authSlice"; // Adjust path if needed

function Layout() {
  const dispatch = useDispatch();
  const { isLoggedIn, attendee,admin } = useSelector((state) => state.auth);
  useEffect(() => {
    const storedAttendee = localStorage.getItem("attendee");
    if (storedAttendee) {
      dispatch(login(JSON.parse(storedAttendee)));
    }
  }, [dispatch]);

  return (
    <>
      {isLoggedIn && admin ? (
        <AdminNavbar />
      ) : isLoggedIn && attendee ? (
        <AttendeeNavbar />
      ) : (
        <MainNavbar />
      )}
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
