import { useState } from "react";
import { useChangePasswordMutation } from "../../store/authApi.js";

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const result = await changePassword(form).unwrap();
      setMessage(result.message || "Password changed successfully.");
    } catch (err) {
      setError(err?.data?.message || "Unable to change password.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[32px] border border-black/10 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sand">Security</p>
          <h1 className="mt-4 text-3xl font-semibold">Change your password</h1>
          <p className="mt-2 text-sm text-gray-500">Update your password with strong credentials for secure access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium">
            Current Password
            <input
              value={form.currentPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              type={showPassword ? "text" : "password"}
              placeholder="Current password"
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
              autoFocus
            />
          </label>
          <label className="block text-sm font-medium">
            New Password
            <input
              value={form.newPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </label>
          <label className="block text-sm font-medium">
            Confirm New Password
            <input
              value={form.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </label>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((value) => !value)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="show-password">Show passwords</label>
          </div>

          {message && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-3xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Updating password..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
