import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";

import "./index.css";
import store from "./Redux/store";
import Login from "./Component/Login/Login.jsx";
import Layout from "./Layout.jsx";
import Home from "./Component/Home/Home.jsx";
import AboutUs from "./Component/AboutUs/AboutUs.jsx";
import ContactUs from "./Component/ContactUs/ContactUs.jsx";
import Register from "./Component/Register/Register.jsx";
import AttendeeDashboard from "./Component/AttendeeDashboard/AttendeeDashboard.jsx"
import UpdateProfile from "./Component/UpdateProfile/UpdateProfile.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<ContactUs />} />
      <Route path="register/:role" element={<Register />} />
      <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />
      <Route path="/update-profile" element={<UpdateProfile />} />

    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}> {/*store setup*/}
  <RouterProvider router={router} />
</Provider>
);
