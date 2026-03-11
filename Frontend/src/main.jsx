import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";

import "./index.css";
import Toast from "./Component/common/Toast/Toast.jsx";

import store from "./Redux/store.js";

import Login from "./pages/Auth/Login.jsx";
import Layout from "./Layout/Layout.jsx";

import Home from "./pages/landing/Home.jsx";
import AboutUs from "./pages/landing/AboutUs.jsx";
import ContactUs from "./pages/landing/ContactUs.jsx";

import Register from "./pages/Auth/Register.jsx";
import AttendeeDashboard from "./pages/Attendee/AttendeeDashboard.jsx";

import UpdateProfile from "./Component/user/UpdateProfile.jsx";

import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./routes/profileProtectedRoutes.jsx";

import PendingManagers from "./pages/Admin/pendingManager.jsx";

import ManagerDashboard from "./pages/Manager/ManagerDashboard.jsx";

import CreateEvent from "./Component/Event/CreateEvent.jsx";
import EventDisplayA from "./Component/Event/EventDisplayA.jsx";

import ViewParticipants from "./Component/user/ViewParticipants.jsx";


import ViewFeedback from "./Component/Feedback/viewFeedback.jsx";

import AdminUserManagement from "./pages/Admin/AdminUserManagement.jsx";
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
      <Route path="/view-feedback/:managerId" element={<ViewFeedback />} />
      <Route path="/manage-user" element={<AdminUserManagement />} />
      <Route path="view-participant/:eventId" element={<ViewParticipants />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    <RouterProvider router={router} />
    <Toast />
  </Provider>
);
