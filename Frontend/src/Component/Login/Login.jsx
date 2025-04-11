import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [userType, setUserType] = useState("attendee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const endpointMap = {
      attendee: "/attendees/login",
      manager: "/managers/login",
      admin: "/admins/login",
    };

    const loginEndpoint = endpointMap[userType];

    try {
      const res = await axios.post(`http://localhost:5000${loginEndpoint}`, {
        email,
        password,
      });

      alert(res.data.message); // Example message like "Login successful"
      console.log("Login success:", res.data);

      // TODO: Redirect to dashboard based on userType if needed
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
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
            className="input w-full mt-1"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="block mt-3">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="input w-full mt-1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
