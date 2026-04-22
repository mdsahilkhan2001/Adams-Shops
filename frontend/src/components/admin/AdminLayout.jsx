import { Link, NavLink } from "react-router-dom";
import { LayoutGrid, Package, Tags, ClipboardList, ArrowLeft } from "lucide-react";
import { getAdminUrl } from "../../utils/urls.js";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <LayoutGrid size={18} /> },
  { label: "Products", to: "/admin/products", icon: <Package size={18} /> },
  { label: "Categories", to: "/admin/categories", icon: <Tags size={18} /> },
  { label: "Orders", to: "/admin/orders", icon: <ClipboardList size={18} /> }
];

const AdminLayout = ({ title, children }) => {
  const djangoAdminUrl = getAdminUrl();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-black/10 bg-white px-6 py-8">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-full border border-gold/60 flex items-center justify-center text-gold font-display">
              A
            </div>
            <div>
              <p className="font-display text-lg">Adams</p>
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Admin</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? "bg-gold text-obsidian" : "text-sand hover:text-ink"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-12 space-y-3">
            <a
              href={djangoAdminUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-black/10 px-4 py-3 text-xs uppercase tracking-[0.3em] text-sand"
            >
              Open Django Admin
            </a>
            <Link
              to="/"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-sand"
            >
              <ArrowLeft size={14} /> Back to Store
            </Link>
          </div>
        </aside>
        <main className="flex-1 px-10 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sand">Adams Admin</p>
              <h1 className="font-display text-3xl">{title}</h1>
            </div>
            <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-sand">
              Bangalore HQ
            </div>
          </div>
          <div className="mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
