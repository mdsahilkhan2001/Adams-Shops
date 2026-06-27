import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { Search, Star, CheckCircle, XCircle, MoreVertical, MessageCircle } from "lucide-react";

const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data - replace with API call
  const reviews = [
    {
      id: 1,
      productName: "Black Abaya",
      customerName: "Fatima Ahmed",
      rating: 5,
      title: "Excellent quality",
      review: "Great product, very comfortable and high quality material. Will definitely order again.",
      status: "approved",
      date: "2024-01-15",
      helpful: 12,
      unhelpful: 1,
    },
    {
      id: 2,
      productName: "Hijab Set",
      customerName: "Aisha Malik",
      rating: 4,
      title: "Good but could be better",
      review: "Nice colors and patterns, but the fit could be improved.",
      status: "pending",
      date: "2024-01-14",
      helpful: 5,
      unhelpful: 0,
    },
    {
      id: 3,
      productName: "Cotton Kaftan",
      customerName: "Zainab Khan",
      rating: 2,
      title: "Not as described",
      review: "The color in the product image looks different from what I received.",
      status: "pending",
      date: "2024-01-13",
      helpful: 8,
      unhelpful: 3,
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || review.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
  };

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Pending Approval</p>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
              <Star fill="currentColor" className="text-amber-400" size={20} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Reviews
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by product, customer, or review text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Reviews</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium text-gray-900">{review.productName}</p>
                  <p className="text-sm text-gray-600">by {review.customerName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"}
                        />
                      ))}
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      review.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {review.status === "approved" ? "Approved" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                <p className="text-gray-600 text-sm">{review.review}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>{new Date(review.date).toLocaleDateString("en-IN")}</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    {review.helpful} helpful, {review.unhelpful} not helpful
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {review.status === "pending" && (
                    <>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition">
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition">
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reviews found matching your search criteria.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
