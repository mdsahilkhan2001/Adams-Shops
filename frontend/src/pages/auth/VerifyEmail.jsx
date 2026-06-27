import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useVerifyEmailMutation, useResendVerificationMutation } from "../../store/authApi.js";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerification] = useResendVerificationMutation();
  const token = searchParams.get("token") || "";

  const handleVerify = async () => {
    setError("");
    setMessage("");

    if (!token) {
      setError("No verification token provided.");
      return;
    }

    try {
      const result = await verifyEmail({ token }).unwrap();
      setMessage(result.message || "Email verified successfully.");
    } catch (err) {
      setError(err?.data?.message || "Unable to verify email.");
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    const email = window.prompt("Enter the email address you registered with:");
    if (!email) return;

    try {
      const result = await resendVerification({ email }).unwrap();
      setMessage(result.message || "Verification email resent.");
    } catch (err) {
      setError(err?.data?.message || "Unable to send verification email.");
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[32px] border border-black/10 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sand">Email verification</p>
          <h1 className="mt-4 text-3xl font-semibold">Verify your email</h1>
          <p className="mt-2 text-sm text-gray-500">Confirm your email address to unlock your full account.</p>
        </div>

        {message && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <div className="space-y-4">
          <button
            onClick={handleVerify}
            className="w-full rounded-3xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Verify email
          </button>
          <button
            onClick={handleResend}
            className="w-full rounded-3xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Resend verification
          </button>
          <Link to="/login" className="block text-center text-sm font-medium text-red-600 hover:text-red-700">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
