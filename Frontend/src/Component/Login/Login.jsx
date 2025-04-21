import React, { useState } from "react";
import axios from "axios";
import { login } from "../../Redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [userType, setUserType] = useState("attendee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const endpointMap = {
      attendee: "/attendees/login",
      manager: "/managers/login",
      admin: "/admin/login",
    };

    const loginEndpoint = endpointMap[userType];

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}${loginEndpoint}`,
        {
          email,
          password,
        }
      );

      alert(res.data.message);
      console.log("Login success:", res.data);

      if (userType === "attendee") {
        dispatch(
          login({
            userType: "attendee",
            userData: res.data.attendee,
            token: res.data.token,
          })
        );
        localStorage.setItem("attendee", JSON.stringify(res.data.attendee));
        localStorage.setItem("token", res.data.token);
        navigate("/attendee-dashboard");

        
      } else if (userType === "admin") {
        dispatch(
          login({
            userType: "admin",
            userData: res.data.admin,
            token: res.data.token,
          })
        );
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        localStorage.setItem("token", res.data.token);
        navigate("/admin-dashboard");
      }
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

          <label htmlFor="userType" className="block mt-2">
            User Type
          </label>
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

          <label htmlFor="email" className="block mt-3">
            Email
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
            autoComplete="email"
          />

          <label htmlFor="password" className="block mt-3">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="input w-full mt-1 pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
               autoComplete="current-password"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="btn btn-neutral w-full mt-4">
            Login
          </button>

          {(userType === "attendee" || userType === "manager") && (
            <div className="flex justify-between mt-3 text-sm">
              <a
                href={`/register/${userType}`}
                className="text-black hover:text-blue-600 transition duration-200"
              >
                Register as{" "}
                <span className="underline font-semibold">{userType}</span>
              </a>
              <a
                href="/forgot-password"
                className="text-black hover:text-blue-600 transition duration-200"
              >
                Forgot Password?
              </a>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
