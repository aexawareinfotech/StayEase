import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaPrint } from 'react-icons/fa';

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showEmailModal, setShowEmailModal] = useState(true);

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

                                <button
                                    className="btn btn-outline-secondary w-100 py-3 fw-bold rounded-pill shadow-sm hover-scale transition mt-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => setShowEmailModal(true)}
                                >
                                    <FaEnvelope /> View Email Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulated Email Modal */}
            {showEmailModal && (
                <div className="modal zoom-in" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                                    <FaEnvelope className="text-primary" /> Email Sent (Simulated)
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowEmailModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="bg-light p-4 rounded-3 text-start">
                                    <p className="mb-2"><strong>To:</strong> User</p>
                                    <p className="mb-3"><strong>Subject:</strong> Booking Confirmation – StayEase</p>
                                    <hr />
                                    <p className="mb-2"><strong>Booking ID:</strong> {bookingId}</p>
                                    <p className="mb-2"><strong>Transaction ID:</strong> {transactionId}</p>
                                    <p className="mb-0"><strong>Total Paid:</strong> ₹ {amountPaid.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0 justify-content-between">
                                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => setShowEmailModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => window.print()}><FaPrint /> Print Email</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentConfirmation;
