import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { Search, AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react";

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data - replace with API call
  const inventoryItems = [
    {
      id: 1,
      productName: "Black Abaya",
      sku: "ABA-BLK-001",
      category: "Abayas",
      currentStock: 45,
      reserved: 12,
      available: 33,
      lowStockThreshold: 20,
      status: "in_stock",
      lastRestocked: "2024-01-10",
    },
    {
      id: 2,
      productName: "Navy Blue Hijab",
      sku: "HIJ-NVY-002",
      category: "Hijabs",
      currentStock: 8,
      reserved: 2,
      available: 6,
      lowStockThreshold: 15,
      status: "low_stock",
      lastRestocked: "2024-01-05",
    },
    {
      id: 3,
      productName: "White Kaftan",
      sku: "KFT-WHT-003",
      category: "Kaftans",
      currentStock: 0,
      reserved: 0,
      available: 0,
      lowStockThreshold: 10,
      status: "out_of_stock",
      lastRestocked: "2023-12-20",
    },
    {
      id: 4,
      productName: "Maroon Abaya",
      sku: "ABA-MRN-004",
      category: "Abayas",
      currentStock: 120,
      reserved: 25,
      available: 95,
      lowStockThreshold: 20,
      status: "in_stock",
      lastRestocked: "2024-01-12",
    },
  ];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalProducts: inventoryItems.length,
    inStock: inventoryItems.filter(i => i.status === "in_stock").length,
    lowStock: inventoryItems.filter(i => i.status === "low_stock").length,
    outOfStock: inventoryItems.filter(i => i.status === "out_of_stock").length,
    totalUnits: inventoryItems.reduce((sum, i) => sum + i.currentStock, 0),
  };

  const categories = ["all", ...new Set(inventoryItems.map(i => i.category))];

  return (
    <AdminLayout title="Inventory Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">In Stock</p>
            <p className="text-3xl font-bold text-green-600">{stats.inStock}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Low Stock</p>
            <p className="text-3xl font-bold text-orange-600">{stats.lowStock}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600">{stats.outOfStock}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Units</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUnits}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Reserved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Last Restocked
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-900">
                        {item.sku}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{item.currentStock}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {item.reserved}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-green-600">{item.available}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "in_stock"
                            ? "bg-green-100 text-green-800"
                            : item.status === "low_stock"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "in_stock"
                          ? "In Stock"
                          : item.status === "low_stock"
                          ? "Low Stock"
                          : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.lastRestocked).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No inventory items found matching your search criteria.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
