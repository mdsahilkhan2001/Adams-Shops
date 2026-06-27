import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../store/authApi.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!email.trim()) {
      setError("Enter your registered email.");
      return;
    }

    try {
      const result = await forgotPassword({ email }).unwrap();
      setMessage(result.message || "Password reset link sent.");
    } catch (err) {
      setError(err?.data?.message || "Unable to send reset email.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[32px] border border-black/10 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sand">Forgot password</p>
          <h1 className="mt-4 text-3xl font-semibold">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-500">Enter the email address linked to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
              autoFocus
            />
          </div>

          {message && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-3xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Sending reset link..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered your password? <Link className="text-red-600 hover:text-red-700" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
