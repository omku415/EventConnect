import React from 'react'

function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen">
    <fieldset className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg">
      <legend className="text-lg font-semibold">Login</legend>
  
      <label className="block mt-2">Email</label>
      <input type="email" className="input w-full mt-1" placeholder="Email" />
  
      <label className="block mt-3">Password</label>
      <input type="password" className="input w-full mt-1" placeholder="Password" />
  
      <button className="btn btn-neutral w-full mt-4">Login</button>
    </fieldset>
  </div>
  
  )
}

export default Login
