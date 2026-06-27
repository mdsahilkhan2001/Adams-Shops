import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../../store/authApi.js";

const getStrengthLabel = (score) => {
  if (score >= 4) return "Strong";
  if (score === 3) return "Good";
  if (score === 2) return "Fair";
  return "Weak";
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [register] = useRegisterMutation();

  const passwordScore = useMemo(() => {
    let score = 0;
    const password = form.password;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [form.password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordScore < 4) {
      setError("Please choose a stronger password.");
      return;
    }

    try {
      const result = await register(form).unwrap();
      if (result.verificationUrl) {
        setSuccess(`Account created. Use this link to verify your email: ${result.verificationUrl}`);
      } else {
        setSuccess("Account created. Check your email to verify your account.");
      }
      setTimeout(() => navigate("/verify-email"), 1400);
    } catch (err) {
      console.error("Register error", err);
      setError(err?.data?.message || err?.error || "Unable to create account.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-[32px] border border-black/10 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sand">Create your account</p>
          <h1 className="mt-4 text-3xl font-semibold">Register with Adams Boutique</h1>
          <p className="mt-2 text-sm text-gray-500">Secure onboarding with email verification and strong password rules.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">First Name</label>
            <input
              value={form.firstName}
              onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              type="text"
              placeholder="First name"
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Last Name</label>
            <input
              value={form.lastName}
              onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              type="text"
              placeholder="Last name"
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Phone Number</label>
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              type="text"
              placeholder="Mobile number"
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
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
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Confirm Password</label>
            <input
              value={form.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              type={showPassword ? "text" : "password"}
              placeholder="Repeat password"
              className="w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="rounded-3xl border border-gray-200 bg-slate-50 p-4 text-sm">
              <p className="font-medium">Password strength</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-2 flex-1 rounded-full bg-gray-200" style={{ width: `${(passwordScore / 5) * 100}%` }} />
                <span className="text-xs font-semibold uppercase text-slate-600">{getStrengthLabel(passwordScore)}</span>
              </div>
              <p className="mt-3 text-xs text-slate-500">Use at least 8 characters with uppercase, lowercase, number and special symbol.</p>
            </div>
          </div>

          {error && <div className="md:col-span-2 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {success && <div className="md:col-span-2 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-3xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Create account
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link className="text-red-600 hover:text-red-700" to="/login">Login instead</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
