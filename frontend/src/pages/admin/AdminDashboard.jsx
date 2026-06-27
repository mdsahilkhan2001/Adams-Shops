import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { useGetDashboardStatsQuery } from "../../store/api.js";
import {
  formatCurrency,
  formatDashboardValue,
  formatGrowthLabel
} from "../../utils/format.js";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users
} from "lucide-react";

const metricIcons = {
  total_orders: ShoppingCart,
  active_products: Package,
  customers: Users,
  revenue: TrendingUp,
  pending_orders: Clock,
  processing_orders: AlertTriangle,
  shipped_orders: Truck,
  delivered_orders: CheckCircle
};

const metricTone = {
  up: "border-emerald-200 bg-emerald-50 text-emerald-700",
  down: "border-rose-200 bg-rose-50 text-rose-700",
  flat: "border-slate-200 bg-slate-50 text-slate-600",
  new: "border-sky-200 bg-sky-50 text-sky-700"
};

const iconTone = {
  total_orders: "bg-amber-50 text-amber-600",
  active_products: "bg-blue-50 text-blue-600",
  customers: "bg-emerald-50 text-emerald-600",
  revenue: "bg-violet-50 text-violet-600",
  pending_orders: "bg-orange-50 text-orange-600",
  processing_orders: "bg-slate-100 text-slate-600",
  shipped_orders: "bg-cyan-50 text-cyan-600",
  delivered_orders: "bg-green-50 text-green-600"
};

const formatDayLabel = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
};

const DashboardCard = ({ card, compact = false }) => {
  const Icon = metricIcons[card.key] || TrendingUp;
  const toneClass = metricTone[card.trend] || metricTone.flat;
  const iconClass = iconTone[card.key] || "bg-slate-100 text-slate-600";
  const value = formatDashboardValue(card.current, card.kind);
  const growthLabel = formatGrowthLabel(card.growth_label);

  return (
    <div className={`rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${compact ? "min-h-[140px]" : "min-h-[168px]"}`}>
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className={`${compact ? "text-2xl" : "text-3xl"} mt-1 font-semibold text-slate-950`}>
                {value}
              </p>
            </div>
          </div>
          {!compact && growthLabel && (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${toneClass}`}>
              {growthLabel}
            </span>
          )}
        </div>

        {!compact && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Previous period</span>
            <span>{formatDashboardValue(card.previous, card.kind)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusCard = ({ card }) => {
  const Icon = metricIcons[card.key] || Package;
  const iconClass = iconTone[card.key] || "bg-slate-100 text-slate-600";

  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {formatDashboardValue(card.current, "count")}
          </p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const cards = data?.cards || [];
  const statusCards = data?.status_cards || [];
  const revenueTrends = data?.revenue_trends || [];
  const topProducts = data?.top_products || [];
  const quickStats = data?.quick_stats || {};
  const maxRevenue = Math.max(...revenueTrends.map((item) => Number(item.revenue) || 0), 0);
  const hasRevenueData = revenueTrends.some((item) => Number(item.revenue) > 0);
  const errorMessage =
    error?.data?.detail ||
    error?.data?.message ||
    error?.error ||
    "Unable to load dashboard data right now.";

  if (isLoading && !data) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-black/10 bg-white px-8 py-10 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
            <p className="text-lg font-semibold text-slate-950">Loading dashboard...</p>
            <p className="text-sm text-slate-500">Fetching live metrics from the backend.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !data) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-xl rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <p className="text-xs uppercase tracking-[0.35em] text-rose-500">Dashboard Error</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">We could not load the admin dashboard.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{errorMessage}</p>
            <button
              type="button"
              onClick={refetch}
              className="mt-6 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 rounded-[32px] border border-black/10 bg-gradient-to-br from-white via-[#fff8ef] to-[#fff2e3] p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Live Overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Real-time totals, delivered revenue, status breakdowns, and top-selling products pulled directly from the backend.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-black/20 hover:bg-slate-50"
            >
              <Loader2 className={`${isFetching ? "animate-spin" : ""} h-4 w-4`} />
              Refresh now
            </button>
            <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
              Auto-refresh every 15s
            </div>
          </div>
        </div>

        {isFetching && data && (
          <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            Refreshing live metrics...
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <DashboardCard key={card.key} card={card} />
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statusCards.map((card) => (
            <StatusCard key={card.key} card={card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
          <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Sales Chart</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Delivered Revenue, Last 7 Days</h2>
              </div>
              <p className="text-sm text-slate-500">
                {hasRevenueData ? "Delivered orders only" : "No delivered revenue yet"}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {revenueTrends.map((item) => {
                const revenue = Number(item.revenue) || 0;
                const width = maxRevenue > 0 ? Math.max((revenue / maxRevenue) * 100, revenue > 0 ? 8 : 2) : 0;

                return (
                  <div key={item.date} className="grid grid-cols-[110px,1fr,120px] items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.label || formatDayLabel(item.date)}</p>
                      <p className="text-xs text-slate-500">{item.orders} orders</p>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(item.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">More Signals</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Quick Stats</h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Low Stock Products</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {formatDashboardValue(quickStats.low_stock_products || 0, "count")}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Pending Reviews</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {formatDashboardValue(quickStats.new_reviews || 0, "count")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
              <p className="text-sm font-medium text-amber-900">Dashboard Snapshot</p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Data reflects the backend state as of{" "}
                <span className="font-semibold">{quickStats.today || "now"}</span>.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Top Sellers</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Top Selling Products</h2>
            </div>
            <p className="text-sm text-slate-500">Units sold and delivered revenue</p>
          </div>

          <div className="mt-6 space-y-4">
            {topProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
                No delivered product sales yet.
              </div>
            ) : (
              topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-950">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.units_sold} units sold</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Delivered Revenue</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
