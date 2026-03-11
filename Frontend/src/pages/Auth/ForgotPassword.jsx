import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("attendee"); // Added state for user type
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send both email and userType to the backend
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
        {
          email,
          userType, // Send the selected user type
        }
      );

      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-base-200 border border-base-300 p-6 rounded-box shadow-lg mx-4"
      >
        <fieldset>
          <legend className="text-lg font-semibold mb-4">
            Forgot Password
          </legend>

          <label htmlFor="email" className="block mt-2">
            Enter your email address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="input w-full mt-1"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="userType" className="block mt-4">
            Select your role
          </label>
          <select
            id="userType"
            className="select select-bordered w-full mt-1"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="attendee">Attendee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="btn btn-neutral w-full mt-4">
            Send Reset Link
          </button>

          {message && (
            <div className="mt-4 text-sm text-center text-success">
              {message}
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
}
