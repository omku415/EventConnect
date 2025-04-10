import React, { useState } from "react";

function Login() {
  const [userType, setUserType] = useState("attendee");

  const handleLogin = (e) => {
    e.preventDefault(); // prevent page reload
    console.log("Logging in as", userType);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-base-200 border border-base-300 p-6 rounded-box shadow-lg mx-4"
      >
        <fieldset>
          <legend className="text-lg font-semibold">Login</legend>

          <label htmlFor="userType" className="block mt-2">User Type</label>
          <select
            id="userType"
            className="select w-full mt-1"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            name="userType"
          >
            <option value="attendee">Attendee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>

          <label htmlFor="email" className="block mt-3">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            className="input w-full mt-1"
            placeholder="Email"
            required
          />

          <label htmlFor="password" className="block mt-3">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            className="input w-full mt-1"
            placeholder="Password"
            required
          />

          <button type="submit" className="btn btn-neutral w-full mt-4">
            Login
          </button>

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
      </form>
    </div>
  );
}

export default Login;
