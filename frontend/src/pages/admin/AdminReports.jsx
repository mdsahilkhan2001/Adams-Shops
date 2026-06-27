import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { FileText, Download, Loader, CheckCircle, XCircle } from "lucide-react";

const AdminReports = () => {
  const [selectedReportType, setSelectedReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportFormat, setExportFormat] = useState("pdf");

  // Mock data - replace with API call
  const reports = [
    {
      id: 1,
      type: "Sales Report",
      reportType: "sales",
      period: "Jan 1 - Jan 31, 2024",
      generatedDate: "2024-01-31",
      format: "PDF",
      size: "2.4 MB",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: 2,
      type: "Revenue Report",
      reportType: "revenue",
      period: "Q1 2024",
      generatedDate: "2024-03-31",
      format: "Excel",
      size: "1.8 MB",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: 3,
      type: "Inventory Report",
      reportType: "inventory",
      period: "Current (Live)",
      generatedDate: "2024-01-15",
      format: "CSV",
      size: "0.5 MB",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: 4,
      type: "Customer Report",
      reportType: "customer",
      period: "Jan 1 - Dec 31, 2023",
      generatedDate: "2024-01-02",
      format: "PDF",
      size: "3.2 MB",
      status: "completed",
      downloadUrl: "#",
    },
    {
      id: 5,
      type: "Product Performance",
      reportType: "product",
      period: "Last 30 Days",
      generatedDate: "Processing...",
      format: "Excel",
      size: "-",
      status: "pending",
      downloadUrl: "#",
    },
  ];

  const reportTypes = [
    { value: "sales", label: "Sales Report", description: "Daily/Monthly sales summary" },
    { value: "revenue", label: "Revenue Report", description: "Revenue trends and metrics" },
    { value: "inventory", label: "Inventory Report", description: "Current stock levels" },
    { value: "customer", label: "Customer Report", description: "Customer demographics and activity" },
    { value: "product", label: "Product Report", description: "Product performance metrics" },
  ];

  const exportFormats = [
    { value: "pdf", label: "PDF (Formatted)" },
    { value: "csv", label: "CSV (Excel Compatible)" },
    { value: "xlsx", label: "Excel (XLSX)" },
  ];

  return (
    <AdminLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Generate Report */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Generate New Report</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Type
              </label>
              <div className="space-y-2">
                {reportTypes.map((report) => (
                  <label
                    key={report.value}
                    className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={report.value}
                      checked={selectedReportType === report.value}
                      onChange={(e) => setSelectedReportType(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{report.label}</p>
                      <p className="text-xs text-gray-600">{report.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range & Format */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {exportFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
              </div>

              <button className="w-full px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Reports</p>
            <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === "completed").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-orange-600">
              {reports.filter(r => r.status === "pending").length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-2">Total Size</p>
            <p className="text-3xl font-bold text-blue-600">
              {(reports
                .filter(r => r.size !== "-")
                .reduce((sum, r) => sum + parseFloat(r.size), 0)
                .toFixed(1))}
              MB
            </p>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Recent Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Generated
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
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="text-gray-400" size={20} />
                        <p className="font-medium text-gray-900">{report.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.period}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.format}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.size}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.generatedDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {report.status === "completed" ? (
                          <>
                            <CheckCircle size={14} /> Completed
                          </>
                        ) : (
                          <>
                            <Loader size={14} className="animate-spin" /> Processing
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {report.status === "completed" && (
                        <button
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          href={report.downloadUrl}
                        >
                          <Download size={16} />
                          <span className="text-sm font-medium">Download</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
