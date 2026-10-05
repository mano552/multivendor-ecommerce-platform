import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Set a new password</h1>
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}
      {done ? (
        <p className="text-green-600 text-center">Password reset! Redirecting to login...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
          <button disabled={loading} className="w-full bg-primary disabled:opacity-60 text-white py-2 rounded-md font-medium">
            {loading ? "Saving..." : "Reset Password"}
          </button>
        </form>
      )}
      <p className="text-center text-sm mt-6">
        <Link to="/login" className="text-primary font-medium">Back to login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
