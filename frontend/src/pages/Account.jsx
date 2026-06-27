import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader.jsx";
import { useSelector } from "react-redux";
import { useGetMeQuery, useLogoutMutation } from "../store/authApi.js";

const Account = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: me } = useGetMeQuery(undefined, { skip: !token });
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="lux-container py-16 space-y-10">
      <SectionHeader
        eyebrow="Account"
        title="Your Boutique Profile"
        description="Manage your orders, wishlist, and saved addresses."
      />

      {!token ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lux-card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Not signed in</p>
            <h3 className="font-display text-2xl">Welcome back to Adams Boutique</h3>
            <p className="text-slate-600">Sign in or create a new account to access your orders, wishlist, and secure checkout.</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Link to="/login" className="lux-button">Login</Link>
              <Link to="/register" className="lux-outline">Register</Link>
            </div>
          </div>
          <div className="lux-card space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sand">Need help?</p>
            <p className="text-slate-600">Forgot your password? Reset it and get back to shopping instantly.</p>
            <Link to="/forgot-password" className="lux-button">Forgot Password</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lux-card space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Profile</p>
              <h3 className="font-display text-xl">
                {me ? `${me.firstName || ""} ${me.lastName || ""}`.trim() : "Member"}
              </h3>
              <p className="text-sand text-sm">{me ? me.email || "Member" : "Member"}</p>
              <button onClick={handleLogout} className="lux-outline">Logout</button>
            </div>
            <div className="lux-card space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Order History</p>
              <p className="text-ink text-lg font-display">3 Orders</p>
              <p className="text-sand text-sm">Latest: Noor Luxe Abaya</p>
              <button className="lux-outline">View Orders</button>
            </div>
            <div className="lux-card space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Wishlist</p>
              <p className="text-ink text-lg font-display">6 Saved Pieces</p>
              <button className="lux-outline">Open Wishlist</button>
            </div>
          </div>
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Saved Addresses</p>
          <div className="rounded-2xl border border-black/10 p-4">
            <p className="text-ink">Bangalore, Karnataka</p>
            <p className="text-sand text-sm">Garden City Residence, 560001</p>
          </div>
          <button className="lux-outline">Add Address</button>
        </div>
        <div className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Concierge</p>
          <p className="text-ink text-lg font-display">Personal Styling</p>
          <p className="text-sand text-sm">
            Book a private styling session for Ramadan and festive edits.
          </p>
          <button className="lux-button">Schedule</button>
        </div>
      </div>

      <div className="lux-card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Admin</p>
          <p className="font-display text-xl">Manage products, orders, and inventory</p>
        </div>
        <Link to="/admin/login" className="lux-button text-center">
          Open Admin Panel
        </Link>
      </div>
    </div>
  );
};

export default Account;
