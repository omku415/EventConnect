import React, { useState } from "react";

function Login() {
  const [userType, setUserType] = useState("attendee");

  const handleLogin = () => {
    // Implement login logic based on userType
    console.log("Logging in as", userType);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <fieldset className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg">
        <legend className="text-lg font-semibold">Login</legend>

        <label className="block mt-2">User Type</label>
        <select
          className="select w-full mt-1"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="attendee">Attendee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <label className="block mt-3">Email</label>
        <input type="email" className="input w-full mt-1" placeholder="Email" />

        <label className="block mt-3">Password</label>
        <input
          type="password"
          className="input w-full mt-1"
          placeholder="Password"
        />

        <button className="btn btn-neutral w-full mt-4" onClick={handleLogin}>
          Login
        </button>

        {/* Show Register button only for attendee and manager */}
        {(userType === "attendee" || userType === "manager") && (
          <div className="text-center mt-3">
            <a
              href={`/register/${userType}`}
              className="text-black hover:text-blue-600 transition duration-200"
            >
              Register as{" "}
              <span className="underline font-semibold">{userType}</span>
            </a>
          </div>
        )}
      </fieldset>
    </div>
  );
}

export default Login;
