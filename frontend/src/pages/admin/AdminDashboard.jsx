import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { useGetCategoriesQuery, useGetOrderAnalyticsQuery, useGetOrdersQuery, useGetProductsQuery } from "../../store/api.js";
import { normalizeProductsResponse } from "../../utils/format.js";

const AdminDashboard = () => {
  const { data: productData } = useGetProductsQuery({ page_size: 1 });
  const { data: categories } = useGetCategoriesQuery();
  const { data: orders } = useGetOrdersQuery();
  const { data: analytics } = useGetOrderAnalyticsQuery();

  const productCount = normalizeProductsResponse(productData).count || 0;
  const categoryCount = categories?.length || 0;
  const orderCount = Array.isArray(orders) ? orders.length : orders?.count || 0;
  const dailySales = analytics?.daily_sales || [];
  const topProducts = analytics?.top_products || [];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="lux-card space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Products</p>
          <p className="font-display text-3xl">{productCount}</p>
          <p className="text-sand text-sm">Active catalog items</p>
        </div>
        <div className="lux-card space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Categories</p>
          <p className="font-display text-3xl">{categoryCount}</p>
          <p className="text-sand text-sm">Curated collections</p>
        </div>
        <div className="lux-card space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Orders</p>
          <p className="font-display text-3xl">{orderCount}</p>
          <p className="text-sand text-sm">Total orders</p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Daily Sales</p>
          <div className="space-y-3 text-sm">
            {dailySales.length === 0 && <p className="text-sand">No sales yet.</p>}
            {dailySales.map((item) => (
              <div key={item.placed_at__date} className="flex items-center justify-between">
                <span>{item.placed_at__date}</span>
                <span className="text-gold">INR {item.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="lux-card space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Top Products</p>
          <div className="space-y-3 text-sm">
            {topProducts.length === 0 && <p className="text-sand">No data yet.</p>}
            {topProducts.map((item) => (
              <div key={item.product__name} className="flex items-center justify-between">
                <span>{item.product__name}</span>
                <span className="text-gold">{item.quantity} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
