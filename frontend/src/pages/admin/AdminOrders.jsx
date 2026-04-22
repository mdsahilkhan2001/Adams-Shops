import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { useGetOrdersQuery, useUpdateOrderMutation } from "../../store/api.js";
import { normalizeProductsResponse } from "../../utils/format.js";

const statusOptions = ["pending", "processing", "shipped", "delivered"];

const AdminOrders = () => {
  const { data: orders } = useGetOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();

  const list = normalizeProductsResponse(orders).items;

  return (
    <AdminLayout title="Orders">
      <div className="lux-card space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Order Management</p>
          <p className="text-xs uppercase tracking-[0.3em] text-sand">Total {list.length}</p>
        </div>
        <div className="space-y-4">
          {list.length === 0 && <p className="text-sand">No orders yet.</p>}
          {list.map((order) => (
            <div key={order.id} className="rounded-2xl border border-black/10 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-lg">Order #{order.id}</p>
                  <p className="text-xs text-sand">Placed {order.placed_at}</p>
                </div>
                <div className="text-gold font-semibold">INR {order.total}</div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-sand">
                <span>Status</span>
                <select
                  value={order.status}
                  onChange={(event) =>
                    updateOrder({ id: order.id, status: event.target.value })
                  }
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-ink"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-sand">
                Items: {order.items?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
