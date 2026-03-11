import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`,
        {
          newPassword,
        }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3s
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md bg-base-200 border border-base-300 p-6 rounded-box shadow-lg mx-4"
      >
        <fieldset>
          <legend className="text-lg font-semibold mb-2">Reset Password</legend>

          <label htmlFor="newPassword" className="block mt-3">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className="input w-full mt-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-neutral w-full mt-4"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {message && <p className="mt-3 text-sm text-center">{message}</p>}
        </fieldset>
      </form>
    </div>
  );
}
