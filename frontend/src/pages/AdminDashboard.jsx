import React, { useState, useEffect } from "react";
import { adminService } from "../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, bookingsRes, revRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllBookings(),
        // Generate a 1-month report
        adminService.getRevenueReport({
          startDate: new Date(
            new Date().setDate(new Date().getDate() - 30),
          ).toISOString(),
          endDate: new Date().toISOString(),
        }),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (bookingsRes.data.success)
        setBookings(bookingsRes.data.data.reverse());
      if (revRes.data.success) setRevenueData(revRes.data.data.dailyBreakdown);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateBookingStatus(id, status);
      fetchDashboardData();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
        <h1 className="fw-bolder text-dark mb-0 fs-2 tracking-wider">
          Dashboard <span className="text-primary">Overview</span>
        </h1>
        <div className="d-flex gap-3">
          <a
            href="/admin/payment-history"
            className="btn btn-outline-success fw-bold px-4 rounded-pill shadow-sm transition hover-scale"
          >
            <i className="bi bi-wallet2 me-2"></i> Payment History
          </a>
          <a
            href="/admin/rooms"
            className="btn btn-primary fw-bold px-4 rounded-pill shadow text-white transition hover-scale"
            style={{
              background: "linear-gradient(to right, #2563eb, #1d4ed8)",
              border: "none",
            }}
          >
            <i className="bi bi-door-open me-2"></i> Manage Rooms
          </a>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="row g-4 mb-5">
        {[
          {
            title: "Today's Check-ins",
            value: stats.checkIns,
            icon: "text-primary bg-primary bg-opacity-10",
            size: "col-md-3",
          },
          {
            title: "Today's Check-outs",
            value: stats.checkOuts,
            icon: "text-danger bg-danger bg-opacity-10",
            size: "col-md-3",
          },
          {
            title: "Active Bookings",
            value: stats.activeBookings || 0,
            icon: "text-success bg-success bg-opacity-10",
            size: "col-md-3",
          },
          {
            title: "Occupancy Rate",
            value: `${stats.occupancyRate}%`,
            icon: "text-warning bg-warning bg-opacity-10",
            size: "col-md-3",
          },

          {
            title: "Available Rooms",
            value: stats.availableRooms || 0,
            icon: "text-info bg-info bg-opacity-10",
            size: "col-md-4",
          },
          {
            title: "Weekly Revenue",
            value: `₹ ${(stats.weeklyRevenue || 0).toLocaleString("en-IN")}`,
            icon: "text-secondary bg-secondary bg-opacity-10",
            size: "col-md-4",
          },
          {
            title: "Monthly Revenue",
            value: `₹ ${(stats.monthlyRevenue || 0).toLocaleString("en-IN")}`,
            icon: "text-dark bg-dark bg-opacity-10",
            size: "col-md-4",
          },
        ].map((stat, i) => (
          <div className={stat.size} key={i}>
            <div className="card border-0 shadow-sm rounded-4 h-100 hover-scale transition">
              <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
                <span className={`p-3 rounded-circle mb-3 ${stat.icon}`}>
                  <i className="bi bi-bar-chart-fill fs-4"></i>
                </span>
                <h6 className="text-muted fw-bold text-uppercase tracking-wider small mb-2">
                  {stat.title}
                </h6>
                <h2 className="fw-bolder text-dark mb-0">{stat.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card border-0 shadow-sm rounded-4 mb-5 p-4">
        <h4 className="fw-bold text-dark border-bottom pb-3 mb-4">
          Revenue Overview{" "}
          <span className="text-muted fs-6 fw-normal">(Last 30 Days)</span>
        </h4>
        <div
          style={{
            width: "100%",
            height: "350px",
            minHeight: "350px",
            maxHeight: "450px",
          }}
        >
          {revenueData && revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="_id"
                  stroke="#6c757d"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#6c757d"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#dee2e6"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)",
                  }}
                  formatter={(value) => [
                    `₹${value.toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                  labelStyle={{ color: "#212529", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="dailyRevenue"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center text-muted fw-bold">
              No revenue data for the selected period.
            </div>
          )}
        </div>
      </div>

      {/* Bookings Management */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-dark mb-0">Recent Bookings</h4>
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2 rounded-pill fs-6">
            {bookings.length} Total
          </span>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 px-4">
                  ID / User
                </th>
                <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">
                  Room
                </th>
                <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">
                  Dates
                </th>
                <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">
                  Price
                </th>
                <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">
                  Status
                </th>
                <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 text-end px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="transition border-bottom">
                  <td className="py-3 px-4">
                    <div className="fw-bolder text-dark">
                      {booking.user?.name || "Unknown"}
                    </div>
                    <div className="text-muted small font-monospace">
                      {booking.transactionId || booking._id}
                    </div>
                  </td>
                  <td>
                    <div className="fw-bold text-primary">
                      {booking.room?.type} Room
                    </div>
                    <div className="text-muted small fw-semibold">
                      No. {booking.room?.roomNumber}
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark small">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                    <div className="text-muted small px-1">
                      to a {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="fw-bold text-success">
                    ₹ {booking.totalPrice.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span
                      className={`badge border shadow-sm px-3 py-2 rounded-pill ${
                        booking.status === "confirmed"
                          ? "bg-primary bg-opacity-10 text-primary border-primary"
                          : booking.status === "checked-in"
                            ? "bg-success bg-opacity-10 text-success border-success"
                            : booking.status === "checked-out"
                              ? "bg-secondary bg-opacity-10 text-secondary border-secondary"
                              : "bg-danger bg-opacity-10 text-danger border-danger"
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-end px-4">
                    <select
                      className="form-select form-select-sm d-inline-block w-auto shadow-sm fw-bold border-secondary bg-light cursor-pointer"
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusUpdate(booking._id, e.target.value)
                      }
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
                .hover-scale { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.03); }
                .tracking-wider { letter-spacing: 0.05em; }
                .fade-in { animation: fadeIn 0.4s ease-in; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
    </div>
  );
};

export default AdminDashboard;
