import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AtendeeRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", // changed from username
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    console.log("Form submitted:", formData);
    try {
      const { confirmPassword, ...userData } = formData;
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attendees/register`,
        userData
      );
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg"
      >
        <legend className="text-lg font-semibold mb-2">User Registration</legend>

        <label htmlFor="name" className="block mt-2">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          className="input w-full mt-1"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone" className="block mt-3">Phone</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          className="input w-full mt-1"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="block mt-3">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          className="input w-full mt-1"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="block mt-3">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          className="input w-full mt-1"
          placeholder="Password"
          value={formData.password}
          autoComplete="new-password"
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword" className="block mt-3">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className="input w-full mt-1"
          placeholder="Confirm Password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary w-full mt-5">
          Register
        </button>
      </form>
    </div>
  );
}

export default AtendeeRegister;
