import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, setAuthError } from "../../store/authSlice.js";
import { useLoginMutation } from "../../store/authApi.js";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials({ token: data.accessToken, user: data.user }));
      navigate(data.user.role === "admin" || data.user.role === "superadmin" ? "/admin/dashboard" : "/account");
    } catch (err) {
      const message = err?.data?.message || "Invalid email or password.";
      setError(message);
      dispatch(setAuthError(message));
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[32px] border border-black/10 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sand">Welcome back</p>
          <h1 className="mt-4 text-3xl font-semibold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-500">Access your orders, wishlist, profile and secure checkout.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              type="email"
              placeholder="you@example.com"
              autoFocus
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(event) => setForm((prev) => ({ ...prev, rememberMe: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-700">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-3xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don’t have an account? <Link className="text-red-600 hover:text-red-700" to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
