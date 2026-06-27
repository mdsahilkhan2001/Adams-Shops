import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/authSlice.js";
import { useAdminLoginMutation } from "../../store/authApi.js";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useAdminLoginMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.email.trim() || !form.password.trim()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials({ token: data.accessToken, user: data.user }));
      navigate("/admin/dashboard");
    } catch (error) {
      setErrorMessage(error?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-black/10 bg-white p-10 shadow-soft">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Admin Access</p>
          <h1 className="font-display text-3xl">Adams Control Suite</h1>
          <p className="text-sand text-sm">Sign in with your admin credentials.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              placeholder="admin@adamsboutique.com"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none"
              autoFocus
            />
          </div>
          <div className="relative">
            <label className="mb-2 block text-sm font-medium text-slate-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-12 text-sm text-slate-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
          <button className="lux-button w-full" disabled={isLoading}>
            {isLoading ? "Signing In" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
