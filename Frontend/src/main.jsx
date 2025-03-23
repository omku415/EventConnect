import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router";
import "./index.css";
import Login from "./Component/Login/Login.jsx";
import Layout from "./Layout.jsx";
import Home from "./Component/Home/Home.jsx";
import AboutUs from "./Component/AboutUs/AboutUs.jsx";
import ContactUs from "./Component/ContactUs/ContactUs.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<ContactUs />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
