import React, { useState, useEffect } from 'react';
import { bookingService } from '../services/api';
import { useLocation } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const location = useLocation();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await bookingService.getMyBookings();
            if (res.data.success) {
                setBookings(res.data.data.reverse()); // Show newest first
            }
        } catch (err) {
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const res = await bookingService.cancelBooking(id);
            if (res.data.success) {
                alert("Booking cancelled successfully.");
                fetchBookings(); // Refresh list
            }
        } catch (err) {
            alert(err.response?.data?.error || "Failed to cancel booking");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {location.state?.message && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 shadow-sm border border-green-200 font-medium text-center">
                        {location.state.message}
                    </div>
                )}

                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b">My Bookings</h1>

                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl">{error}</div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-700">No bookings found</h2>
                        <p className="text-gray-500 mt-2">You haven't made any reservations yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((b) => (
                            <div key={b._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row gap-6 relative">
                                <div className="absolute top-4 right-6 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-500 shadow-sm bg-gray-50">
                                    {b.transactionId}
                                </div>

                                <div className="w-full md:w-1/4">
                                    <img
                                        src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                                        alt={b.room.type}
                                        className="w-full h-auto md:h-full object-cover rounded-xl shadow-sm"
                                    />
                                </div>
                                <div className="w-full md:w-3/4 flex flex-col justify-between pt-6 md:pt-0">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900">{b.room.type} Room</h2>
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm inline-block ${b.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                b.status === 'checked-in' ? 'bg-emerald-100 text-emerald-800' :
                                                    b.status === 'checked-out' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {b.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 font-medium">Room {b.room.roomNumber}</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                                            <p className="text-xs text-blue-800 font-semibold mb-1 border-b border-blue-200 pb-1">Check-in</p>
                                            <p className="text-sm font-bold text-gray-800">{new Date(b.checkIn).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                                            <p className="text-xs text-blue-800 font-semibold mb-1 border-b border-blue-200 pb-1">Check-out</p>
                                            <p className="text-sm font-bold text-gray-800">{new Date(b.checkOut).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                                            <p className="text-xs text-gray-600 font-semibold mb-1 border-b border-gray-200 pb-1">Guests</p>
                                            <p className="text-sm font-bold text-gray-800">{b.guests}</p>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200 shadow-sm">
                                            <p className="text-xs text-green-800 font-semibold mb-1 border-b border-green-200 pb-1">Total Price</p>
                                            <p className="text-sm font-extrabold text-green-700">₹ {b.totalPrice.toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        {b.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleCancel(b._id)}
                                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 font-bold py-2.5 px-6 rounded-xl transition duration-150 shadow-sm"
                                            >
                                                Cancel Reservation
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
