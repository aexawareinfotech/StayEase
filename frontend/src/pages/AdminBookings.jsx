import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchBookings(), 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, filterStatus]);

    const fetchBookings = async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterStatus !== 'all') params.status = filterStatus;
            
            const res = await adminService.getAllBookings(params);
            if (res.data.success) {
                setBookings(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await adminService.updateBookingStatus(id, status);
            // Local state update prevents entire list rerender layout jumps
            setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
        } catch (error) {
            alert('Status update failed');
        }
    };

    const handleCancelSelected = async (id) => {
        if (window.confirm('Are you absolutely sure you want to force cancel this booking?')) {
            await handleStatusUpdate(id, 'cancelled');
        }
    }

    const filteredBookings = bookings;

    if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container-fluid py-4 fade-in">
            <h1 className="fw-bolder text-dark mb-4 fs-2 tracking-wider border-bottom pb-3">Bookings <span className="text-primary">Master List</span></h1>

            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-4 bg-white rounded-4">
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control form-control-lg bg-light border-0 shadow-sm"
                                placeholder="Search by Guest Name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select form-select-lg bg-light border-0 shadow-sm cursor-pointer fw-bold text-secondary"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="checked-in">Checked-In</option>
                                <option value="checked-out">Checked-Out</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="col-md-3 d-flex align-items-center justify-content-end text-muted fw-bold">
                            Total Records: <span className="text-primary ms-2 fs-5">{filteredBookings.length}</span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Booking Reference</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Guest Overview</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Property</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3">Timeline</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 text-center">Status</th>
                                    <th className="text-secondary fw-bold small text-uppercase tracking-wider py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="transition border-bottom">
                                        <td>
                                            <div className="text-dark font-monospace fw-bold">{booking._id.substring(booking._id.length - 8).toUpperCase()}</div>
                                            {booking.transactionId && <div className="badge bg-secondary bg-opacity-10 text-secondary mb-1">Txn: {booking.transactionId}</div>}
                                        </td>
                                        <td>
                                            <div className="fw-bolder text-dark">{booking.user?.name || 'Unknown'}</div>
                                            <div className="text-muted small">{booking.user?.email}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-primary">{booking.room?.type} Room</div>
                                            <div className="text-muted small fw-semibold">No. {booking.room?.roomNumber}</div>
                                        </td>
                                        <td>
                                            <div className="text-dark small fw-bold">In: {new Date(booking.checkIn).toLocaleDateString()}</div>
                                            <div className="text-danger small fw-bold mt-1">Out: {new Date(booking.checkOut).toLocaleDateString()}</div>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge border shadow-sm px-3 py-2 rounded-lg text-uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-primary bg-opacity-10 text-primary border-primary' :
                                                booking.status === 'checked-in' ? 'bg-success bg-opacity-10 text-success border-success' :
                                                    booking.status === 'checked-out' ? 'bg-secondary bg-opacity-10 text-secondary border-secondary' :
                                                        'bg-danger bg-opacity-10 text-danger border-danger'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="d-flex justify-content-end gap-2">
                                                <select
                                                    className="form-select form-select-sm w-auto shadow-sm fw-bold border-secondary bg-light cursor-pointer"
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                >
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="checked-in">Check In</option>
                                                    <option value="checked-out">Check Out</option>
                                                </select>
                                                {booking.status !== 'cancelled' && (
                                                    <button onClick={() => handleCancelSelected(booking._id)} className="btn btn-sm btn-outline-danger shadow-sm fw-bold px-3">
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredBookings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-5 fw-bold fs-5">No bookings found matching criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .tracking-wider { letter-spacing: 0.05em; }
                .fade-in { animation: fadeIn 0.4s ease-in; }
                .cursor-pointer { cursor: pointer; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AdminBookings;
