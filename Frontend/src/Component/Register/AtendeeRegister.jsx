import React, { useState } from 'react';

function AtendeeRegister() {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation example
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log('Form submitted:', formData);
    // TODO: Send to backend here
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg"
      >
        <legend className="text-lg font-semibold mb-2">User Registration</legend>

        <label className="block mt-2">Username</label>
        <input
          type="text"
          name="username"
          className="input w-full mt-1"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label className="block mt-3">Phone</label>
        <input
          type="tel"
          name="phone"
          className="input w-full mt-1"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label className="block mt-3">Email</label>
        <input
          type="email"
          name="email"
          className="input w-full mt-1"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="block mt-3">Password</label>
        <input
          type="password"
          name="password"
          className="input w-full mt-1"
          placeholder="Password"
          value={formData.password}
          autoComplete="new-password" 
          onChange={handleChange}
          required
        />

        <label className="block mt-3">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          className="input w-full mt-1"
          placeholder="Confirm Password"
          autoComplete="new-password" 
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-full mt-5"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default AtendeeRegister;
