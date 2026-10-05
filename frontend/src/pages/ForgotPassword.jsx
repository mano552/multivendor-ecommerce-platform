import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSent(true);
      setDevResetUrl(data.devResetUrl || null);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Reset your password</h1>
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{error}</p>}
      {sent ? (
        <div className="text-center">
          <p className="text-green-600 mb-4">
            If an account exists for {email}, a reset link has been sent.
          </p>
          {!devResetUrl && (
            <p className="text-xs text-gray-400 mb-4">
              No link above? For security we never confirm whether an email is registered.
              Double-check you typed the exact email you signed up with — or try a seeded demo
              account: <code>buyer@shopo.com</code>, <code>seller@shopo.com</code>, or{" "}
              <code>admin@shopo.com</code>.
            </p>
          )}
          {devResetUrl && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-left">
              <p className="text-sm text-yellow-800 mb-2">
                Email sending isn't configured yet (no SMTP in <code>.env</code>), so here's your
                reset link directly — click it to continue:
              </p>
              <Link to={devResetUrl.replace(/^https?:\/\/[^/]+/, "")} className="text-primary text-sm break-all underline">
                {devResetUrl}
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-primary disabled:opacity-60 text-white py-2 rounded-md font-medium">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
      <p className="text-center text-sm mt-6">
        <Link to="/login" className="text-primary font-medium">Back to login</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
