import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../store/authSlice.js";
import { useLazyGetMeQuery, useLoginMutation } from "../../store/api.js";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [getMe] = useLazyGetMeQuery();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const data = await login(form).unwrap();
      dispatch(setCredentials({ token: data.access, user: null }));
      const me = await getMe().unwrap();
      dispatch(setCredentials({ token: data.access, user: me }));

      if (!me.is_staff) {
        setErrorMessage("Admin access required.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (error) {
      setErrorMessage("Login failed. Check credentials.");
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
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none"
          />
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
