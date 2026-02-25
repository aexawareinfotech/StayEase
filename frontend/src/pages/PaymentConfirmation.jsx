import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state;

    if (!state) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="text-center">
                    <h3 className="text-danger fw-bold">Transaction Unavailable</h3>
                    <button className="btn btn-primary mt-3" onClick={() => navigate('/my-bookings')}>Return to Bookings</button>
                </div>
            </div>
        );
    }

    const { transactionId, amountPaid, paymentMethod, bookingId } = state;

    return (
        <div className="bg-light min-vh-100 py-5 font-sans d-flex align-items-center">
            <div className="container" data-aos="zoom-in">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-7">
                        <div className="card shadow-lg border-0 rounded-4 text-center">
                            <div className="card-body p-5">
                                <div className="text-success mb-4">
                                    <FaCheckCircle size={80} className="pulse-animation rounded-circle bg-success bg-opacity-10 p-2" />
                                </div>
                                <h2 className="fw-bolder text-dark mb-2">Payment Successful!</h2>
                                <p className="text-muted mb-4">Your booking has been secured.</p>

                                <div className="bg-light p-4 rounded-3 border text-start mb-4 shadow-sm">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary fw-semibold">Amount Paid</span>
                                        <span className="fw-bold text-success fs-5">₹ {amountPaid.toLocaleString("en-IN")}</span>
                                    </div>
                                    <hr className="text-secondary opacity-25" />
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary fw-semibold">Transaction ID</span>
                                        <span className="fw-bold font-monospace">{transactionId}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary fw-semibold">Payment Method</span>
                                        <span className="fw-bold">{paymentMethod}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary fw-semibold">Booking ID</span>
                                        <span className="fw-bold text-muted small">{bookingId}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm hover-scale transition"
                                    onClick={() => navigate('/my-bookings', { state: { message: "Payment & Booking Confirmed!" } })}
                                >
                                    Go to My Bookings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmation;
