import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { bookingService } from '../services/api';

const Booking = () => {
    const { bookingDetails, clearBookingDetails } = useContext(BookingContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!bookingDetails.room) {
            navigate('/rooms');
        }
    }, [bookingDetails, navigate]);

    if (!bookingDetails.room) return null;

    const { room, checkIn, checkOut, guests, totalPrice } = bookingDetails;
    const cin = new Date(checkIn);
    const cout = new Date(checkOut);

    const handleConfirmBooking = async () => {
        setLoading(true);
        setError('');
        try {
            const data = {
                room: room._id,
                checkIn: new Date(checkIn).toISOString(),
                checkOut: new Date(checkOut).toISOString(),
                guests,
                // Total price gets finalized on backend, we just send basic requirements 
            };
            const res = await bookingService.createBooking(data);
            if (res.data.success) {
                navigate(`/payment/${res.data.data._id}`, { state: { totalPrice } });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || "";
            if (errorMsg.toLowerCase().includes("duplicate") || errorMsg.toLowerCase().includes("booked")) {
                setError("Room already booked for selected dates");
            } else {
                setError("Booking failed. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Booking Summary</h1>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="w-full md:w-1/3">
                        <img
                            src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                            alt={room.type}
                            className="w-full h-48 object-cover rounded-2xl shadow-md"
                        />
                    </div>
                    <div className="w-full md:w-2/3 space-y-4">
                        <div className="flex justify-between">
                            <h2 className="text-2xl font-bold text-gray-800">{room.type} Room</h2>
                            <p className="text-xl font-bold text-blue-600">₹ {room.price.toLocaleString("en-IN")} / night</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Check-in</span>
                                <span className="font-semibold text-gray-800">{cin.toDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Check-out</span>
                                <span className="font-semibold text-gray-800">{cout.toDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Guests</span>
                                <span className="font-semibold text-gray-800">{guests} Guest(s)</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between">
                                <span className="text-gray-700 font-bold">Total Stay</span>
                                <span className="font-bold text-gray-800">{Math.round(Math.abs((cout - cin) / (1000 * 60 * 60 * 24)))} Night(s)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Total Amount</h3>
                        <p className="text-3xl font-extrabold text-blue-600">₹ {totalPrice.toLocaleString("en-IN")}</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl mb-8">
                        <h4 className="font-bold text-blue-800 mb-2">Simulated Payment</h4>
                        <p className="text-blue-600 text-sm">By confirming this booking, we are simulating a successful payment gateway transaction.</p>
                    </div>

                    <button
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 disabled:bg-blue-300 text-lg"
                    >
                        {loading ? 'Processing Transaction...' : 'Confirm & Pay'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Booking;
