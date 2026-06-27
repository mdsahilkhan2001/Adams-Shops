import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutGrid, Package, Tags, ClipboardList, ArrowLeft, 
  Users, MessageSquare, Zap, BarChart3, Bell, LogOut,
  Menu, X
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../store/authSlice.js";
import { getAdminUrl } from "../../utils/urls.js";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: <LayoutGrid size={18} /> },
  { label: "Products", to: "/admin/products", icon: <Package size={18} /> },
  { label: "Categories", to: "/admin/categories", icon: <Tags size={18} /> },
  { label: "Orders", to: "/admin/orders", icon: <ClipboardList size={18} /> },
  { label: "Customers", to: "/admin/customers", icon: <Users size={18} /> },
  { label: "Reviews", to: "/admin/reviews", icon: <MessageSquare size={18} /> },
  { label: "Coupons", to: "/admin/coupons", icon: <Zap size={18} /> },
  { label: "Inventory", to: "/admin/inventory", icon: <BarChart3 size={18} /> },
  { label: "Reports", to: "/admin/reports", icon: <BarChart3 size={18} /> },
];

const notificationItems = [
  {
    title: "Pending orders",
    message: "Review new orders waiting for fulfillment.",
    to: "/admin/orders"
  },
  {
    title: "Inventory check",
    message: "Check stock levels before products run out.",
    to: "/admin/inventory"
  },
  {
    title: "Review queue",
    message: "Moderate the latest customer reviews.",
    to: "/admin/reviews"
  }
];

const AdminLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const djangoAdminUrl = getAdminUrl();
  const visibleNotifications = notificationsRead ? [] : notificationItems;
  const displayName = user?.username || user?.firstName || user?.email || "Admin";
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/admin/login");
  };

  const markNotificationsRead = () => {
    setNotificationsRead(true);
    setNotificationOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white px-6 py-8 transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="font-bold text-lg text-gray-900">Adams</p>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition ${
                    isActive 
                      ? "bg-amber-100 text-amber-900 font-medium" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-gray-200">
            <a
              href={djangoAdminUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg border border-gray-200 px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 mb-2"
            >
              Django Admin
            </a>
            <Link
              to="/"
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 px-4 py-2"
            >
              <ArrowLeft size={14} /> Back to Store
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 px-4 py-2 w-full"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="border-b border-gray-200 bg-white px-6 py-4 lg:px-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu size={24} className="text-gray-600" />
                </button>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Admin Panel</p>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationOpen((prev) => !prev)}
                    className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                    aria-label="Open notifications"
                    aria-expanded={notificationOpen}
                  >
                    <Bell size={20} />
                    {visibleNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  {notificationOpen && (
                    <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                        {visibleNotifications.length > 0 && (
                          <button
                            type="button"
                            onClick={markNotificationsRead}
                            className="text-xs font-medium text-amber-700 hover:text-amber-900"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {visibleNotifications.length === 0 ? (
                          <p className="rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-500">
                            No new notifications.
                          </p>
                        ) : (
                          visibleNotifications.map((item) => (
                            <Link
                              key={item.title}
                              to={item.to}
                              onClick={() => setNotificationOpen(false)}
                              className="block rounded-lg border border-gray-100 px-3 py-3 text-left hover:bg-amber-50"
                            >
                              <p className="text-sm font-medium text-gray-900">{item.title}</p>
                              <p className="mt-1 text-xs text-gray-500">{item.message}</p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center text-sm font-bold text-amber-900">
                    {displayInitial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
