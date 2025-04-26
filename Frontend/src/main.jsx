import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";

import "./index.css";
import Toast from "../Toast.jsx";
import store from "./Redux/store";
import Login from "./Component/Login/Login.jsx";
import Layout from "./Layout.jsx";
import Home from "./Component/Home/Home.jsx";
import AboutUs from "./Component/AboutUs/AboutUs.jsx";
import ContactUs from "./Component/ContactUs/ContactUs.jsx";
import Register from "./Component/Register/Register.jsx";
import AttendeeDashboard from "./Component/AttendeeDashboard/AttendeeDashboard.jsx";
import UpdateProfile from "./Component/UpdateProfile/UpdateProfile.jsx";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./Component/ForgotPassword/ResetPassword.jsx";
import AdminDashboard from "./Component/AdminDashboard/AdminDashboard.jsx";
import ProtectedRoute from "./Component/ProtecetedRoutes/profileProtectedRoutes.jsx";
import PendingManagers from "./Component/PendingManager/pendingManager.jsx";
import ManagerDashboard from "./Component/ManagerDashboard/ManagerDashboard.jsx";
import CreateEvent from "./Component/CreateEvents/CreateEvent.jsx";
import EventDisplayA from "./Component/EventDisplay/EventDisplayA.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<ContactUs />} />
      <Route path="register/:role" element={<Register />} />
      <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />
      <Route
        path="/update-profile"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/pending-managers" element={<PendingManagers />} />
      <Route path="manager-dashboard" element={<ManagerDashboard />} />
      <Route path="/create-events" element={<CreateEvent />} />
      <Route path="/verify-events" element={<EventDisplayA />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    {/*store setup*/}
    <RouterProvider router={router} />
    <Toast />
  </Provider>
);
