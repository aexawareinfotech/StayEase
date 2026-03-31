import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AdminReports = () => {
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const startDate = new Date(dateRange.startDate).toISOString();
            const endDate = new Date(dateRange.endDate).toISOString();
            
            const res = await adminService.getReports({ startDate, endDate });
            if (res.data.success) {
                setReport(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setDateRange(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        fetchReports();
    };

    const exportToCSV = () => {
        if (!report || !report.bookings) return;

        const headers = ['Booking ID', 'Status', 'Total Price (INR)', 'Check-in', 'Check-out'];
        const csvRows = [];
        csvRows.push(headers.join(','));

        report.bookings.forEach(b => {
            csvRows.push(`${b.bookingId || b._id},${b.status},${b.totalPrice || b.totalAmount},${b.checkIn.split('T')[0]},${b.checkOut.split('T')[0]}`);
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stayease-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading && !report) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;

    const chartData = report?.bookings?.map((b) => ({
        date: new Date(b.createdAt).toLocaleDateString(),
        revenue: b.totalPrice || b.totalAmount || 0
    })) || [];

    return (
        <div className="container-fluid py-4 fade-in">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
                <h1 className="fw-bolder text-dark mb-0 fs-2 tracking-wider">Reports <span className="text-primary">& Analytics</span></h1>
                <button onClick={exportToCSV} className="btn btn-outline-success fw-bold px-4 rounded-pill shadow-sm transition hover-scale">
                    <i className="bi bi-download me-2"></i> Export CSV
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-5 p-4 bg-white">
                <form onSubmit={handleGenerate} className="row g-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label text-muted fw-bold small text-uppercase tracking-wider">Start Date</label>
                        <input type="date" className="form-control form-control-lg bg-light border-0 shadow-sm" name="startDate" value={dateRange.startDate} onChange={handleDateChange} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label text-muted fw-bold small text-uppercase tracking-wider">End Date</label>
                        <input type="date" className="form-control form-control-lg bg-light border-0 shadow-sm" name="endDate" value={dateRange.endDate} onChange={handleDateChange} required />
                    </div>
                    <div className="col-md-4">
                        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-100 fw-bold rounded-pill shadow transition hover-scale" style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)', border: 'none' }}>
                            {loading ? 'Generating...' : 'Generate New Report'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Summaries */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4 h-100 bg-primary bg-opacity-10 text-primary hover-scale transition">
                        <div className="card-body p-4 d-flex flex-column align-items-start justify-content-center">
                            <h6 className="fw-bold tracking-wider text-uppercase small mb-2 opacity-75">Generated Revenue</h6>
                            <h2 className="fw-bolder mb-0">₹ {report?.totalRevenue?.toLocaleString("en-IN") || 0}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4 h-100 bg-success bg-opacity-10 text-success hover-scale transition">
                        <div className="card-body p-4 d-flex flex-column align-items-start justify-content-center">
                            <h6 className="fw-bold tracking-wider text-uppercase small mb-2 opacity-75">Occupancy Rate</h6>
                            <h2 className="fw-bolder mb-0">{report?.occupancyRate || '0.00'}%</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 rounded-4 h-100 bg-info bg-opacity-10 text-info hover-scale transition">
                        <div className="card-body p-4 d-flex flex-column align-items-start justify-content-center">
                            <h6 className="fw-bold tracking-wider text-uppercase small mb-2 opacity-75">Total Bookings Executed</h6>
                            <h2 className="fw-bolder mb-0">{report?.totalBookings || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-5">
                <div className="col-lg-12">
                    <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                        <h4 className="fw-bold text-dark border-bottom pb-3 mb-4">Earnings Chart</h4>
                        {chartData.length > 0 ? (
                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <XAxis dataKey="date" stroke="#6c757d" fontSize={12} tickMargin={10} />
                                        <YAxis stroke="#6c757d" fontSize={12} tickFormatter={v => `₹${Number(v).toLocaleString("en-IN")}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)' }} />
                                        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#007bff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-100 p-5 d-flex align-items-center justify-content-center text-muted fw-bold">
                                <p>No data available</p>
                            </div>
                        )}
                    </div>
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

export default AdminReports;
