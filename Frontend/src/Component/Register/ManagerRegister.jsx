import React, { useState } from 'react';

function ManagerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',              
    password: '',
    confirmPassword: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg"
      >
        <legend className="text-lg font-semibold mb-2">Manager Registration</legend>

        <label htmlFor="name" className="block mt-2">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input w-full mt-1"
          placeholder="Full Name"
          required
        />

        <label htmlFor="email" className="block mt-3">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input w-full mt-1"
          placeholder="Email"
          required
        />

        <label htmlFor="phone" className="block mt-3">Phone Number</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input w-full mt-1"
          placeholder="Phone Number"
          required
        />

        <label htmlFor="password" className="block mt-3">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          autoComplete="new-password" 
          onChange={handleChange}
          className="input w-full mt-1"
          placeholder="Password"
          required
        />

        <label htmlFor="confirmPassword" className="block mt-3">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          autoComplete="new-password" 
          onChange={handleChange}
          className="input w-full mt-1"
          placeholder="Confirm Password"
          required
        />

        <label htmlFor="resume" className="block mt-3">Upload Resume</label>
        <input
          id="resume"
          type="file"
          name="resume"
          onChange={handleChange}
          className="file-input w-full mt-1"
          accept=".pdf,.doc,.docx"
          required
        />

        <button className="btn btn-neutral w-full mt-5" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default ManagerRegister;
