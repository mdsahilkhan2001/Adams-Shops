import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { Search, Plus, Edit2, Trash2, Copy, Eye, Calendar } from "lucide-react";

const AdminCoupons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - replace with API call
  const coupons = [
    {
      id: 1,
      code: "WELCOME20",
      type: "percentage",
      value: 20,
      minCart: 500,
      usageLimit: 100,
      usedCount: 45,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      isActive: true,
      categories: ["Abayas", "Hijabs"],
    },
    {
      id: 2,
      code: "FIRST500",
      type: "fixed",
      value: 500,
      minCart: 1000,
      usageLimit: 50,
      usedCount: 28,
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      isActive: true,
      categories: ["All"],
    },
    {
      id: 3,
      code: "FREESHIP",
      type: "free_shipping",
      value: 0,
      minCart: 0,
      usageLimit: 200,
      usedCount: 150,
      startDate: "2024-01-01",
      endDate: "2024-02-28",
      isActive: false,
      categories: ["All"],
    },
  ];

  const filteredCoupons = coupons.filter((coupon) => {
    return (
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.type.includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter(c => c.isActive).length,
    totalUsed: coupons.reduce((sum, c) => sum + c.usedCount, 0),
    totalDiscount: coupons.reduce((sum, c) => {
      if (c.type === "percentage") return sum + (c.value * c.usedCount * 100) / 100;
      return sum + (c.value * c.usedCount);
    }, 0),
  };

  return (
    <AdminLayout title="Coupons & Discounts">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Coupons</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCoupons}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Active</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeCoupons}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Used</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsed}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Discount</p>
            <p className="text-3xl font-bold text-amber-600">₹{stats.totalDiscount.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Header & Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Coupons
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by code or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
            >
              <Plus size={18} />
              Create Coupon
            </button>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1 bg-gray-100 rounded font-mono text-sm font-medium text-gray-900">
                          {coupon.code}
                        </code>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        coupon.type === "percentage"
                          ? "bg-blue-100 text-blue-800"
                          : coupon.type === "fixed"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {coupon.type === "percentage"
                          ? "Percentage"
                          : coupon.type === "fixed"
                          ? "Fixed Amount"
                          : "Free Shipping"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : coupon.type === "fixed"
                        ? `₹${coupon.value}`
                        : "Free"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </p>
                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{
                              width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        {new Date(coupon.endDate).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCoupons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No coupons found matching your search criteria.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
