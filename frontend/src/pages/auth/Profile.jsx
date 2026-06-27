import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMeQuery, useUpdateProfileMutation } from "../../store/authApi.js";

const Profile = () => {
  const authUser = useSelector((state) => state.auth.user);
  const { data: user, isLoading, isError } = useGetMeQuery(undefined, { skip: !authUser });
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await updateProfile({ firstName: form.firstName, lastName: form.lastName, phone: form.phone }).unwrap();
      setMessage(response.message || "Profile updated successfully.");
    } catch (err) {
      setError(err?.data?.message || "Unable to update profile.");
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
        <p>Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink py-12 px-4">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-black/10 bg-white p-10 shadow-xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.35em] text-sand">Account settings</p>
          <h1 className="mt-4 text-3xl font-semibold">Your profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium">
              First Name
              <input
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                type="text"
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
              />
            </label>
            <label className="block text-sm font-medium">
              Last Name
              <input
                value={form.lastName}
                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                type="text"
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium">
              Email
              <input
                value={form.email}
                readOnly
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
              />
            </label>
            <label className="block text-sm font-medium">
              Phone
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                type="text"
                className="mt-2 w-full rounded-3xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-500"
              />
            </label>
          </div>

          {message && <p className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
          {error && <p className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-3xl bg-red-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUpdating ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
