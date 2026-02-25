import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
                    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
                    endDate: new Date().toISOString()
                })
            ]);

            if (statsRes.data.success) setStats(statsRes.data.data);
            if (bookingsRes.data.success) setBookings(bookingsRes.data.data.reverse());
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
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
                    <a href="/rooms" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-200 text-decoration-none">
                        Manage Rooms
                    </a>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-4xl font-extrabold text-blue-600">₹ {stats.totalRevenue.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Active Bookings</p>
                        <p className="text-4xl font-extrabold text-emerald-600">{stats.activeBookings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Today's Check-ins</p>
                        <p className="text-4xl font-extrabold text-indigo-600">{stats.todaysCheckIns}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
                        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">Today's Check-outs</p>
                        <p className="text-4xl font-extrabold text-red-600">{stats.todaysCheckOuts}</p>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Revenue Overview (Last 30 Days)</h2>
                    {revenueData && revenueData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, 'Revenue']}
                                    labelStyle={{ color: '#475569', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="dailyRevenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400 font-medium">No revenue data for the selected period.</div>
                    )}
                </div>

                {/* Bookings Management */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{bookings.length} Total</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID / User</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{booking.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{booking.transactionId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-800">{booking.room?.type} Rm</div>
                                            <div className="text-xs text-gray-500">No. {booking.room?.roomNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            {new Date(booking.checkIn).toLocaleDateString()} <span className="text-gray-400">to</span><br /> {new Date(booking.checkOut).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                            ₹ {booking.totalPrice.toLocaleString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm ${booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                booking.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    booking.status === 'checked-out' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                                                        'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <select
                                                className="bg-white border border-gray-300 text-gray-700 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2 shadow-sm font-semibold cursor-pointer outline-none"
                                                value={booking.status}
                                                onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
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
            </div>
        </div>
    );
};

export default AdminDashboard;
