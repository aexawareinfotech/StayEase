import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/api';
import { BookingContext } from '../context/BookingContext';
import { FaCreditCard, FaRegCreditCard, FaMobileAlt } from 'react-icons/fa';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { clearBookingDetails } = useContext(BookingContext);

    const [method, setMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const totalPrice = location.state?.totalPrice || 0;

    // Form inputs
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [upiId, setUpiId] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();

        // Simple UI validation
        if (method === 'Credit Card' || method === 'Debit Card') {
            if (cardNumber.length !== 16 || cvv.length !== 3) {
                setError('Please ensure Card Number is 16 digits and CVV is 3 digits.');
                return;
            }
        }
        if (method === 'UPI') {
            if (!upiId.includes('@')) {
                setError('Please enter a valid UPI ID (e.g. user@khdfc).');
                return;
            }
        }

        setError('');
        setLoading(true);

        // Simulate network delay / 2 second spinner
        setTimeout(async () => {
            try {
                const res = await bookingService.payBooking(bookingId, method);
                if (res.data.success) {
                    clearBookingDetails();
                    navigate(`/payment-confirmation/${bookingId}`, {
                        state: {
                            transactionId: res.data.data.transactionId,
                            amountPaid: totalPrice,
                            paymentMethod: method,
                            bookingId: bookingId
                        }
                    });
                }
            } catch (err) {
                setError(err.response?.data?.error || 'Payment failed.');
                setLoading(false);
            }
        }, 2000);
    };

    return (
        <div className="bg-light min-vh-100 py-5 font-sans">
            <div className="container" data-aos="fade-up">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header bg-white text-center border-0 pt-5 pb-3">
                                <h2 className="fw-bold text-dark mb-0">Select Payment Method</h2>
                                <p className="text-muted mt-2">Complete your booking for ₹ {totalPrice.toLocaleString("en-IN")}</p>
                            </div>

                            <div className="card-body px-5 pb-5">
                                {error && <div className="alert alert-danger rounded-3">{error}</div>}

                                <div className="d-flex flex-column gap-3 mb-4">
                                    <div
                                        className={`p-3 border rounded-3 cursor-pointer d-flex align-items-center transition ${method === 'Credit Card' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'}`}
                                        onClick={() => setMethod('Credit Card')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaCreditCard className="text-primary fs-4 me-3" />
                                        <span className="fw-bold">Credit Card</span>
                                    </div>

                                    <div
                                        className={`p-3 border rounded-3 cursor-pointer d-flex align-items-center transition ${method === 'Debit Card' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'}`}
                                        onClick={() => setMethod('Debit Card')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaRegCreditCard className="text-primary fs-4 me-3" />
                                        <span className="fw-bold">Debit Card</span>
                                    </div>

                                    <div
                                        className={`p-3 border rounded-3 cursor-pointer d-flex align-items-center transition ${method === 'UPI' ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'}`}
                                        onClick={() => setMethod('UPI')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <FaMobileAlt className="text-primary fs-4 me-3" />
                                        <span className="fw-bold">UPI Payment</span>
                                    </div>
                                </div>

                                {method && (
                                    <form onSubmit={handlePayment} className="mt-4" data-aos="fade-in">
                                        <h5 className="fw-bold mb-3">{method} Details</h5>

                                        {(method === 'Credit Card' || method === 'Debit Card') && (
                                            <>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary fw-semibold">Card Number</label>
                                                    <input type="text" className="form-control" maxLength="16" placeholder="1234 5678 1234 5678" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} required disabled={loading} />
                                                </div>
                                                <div className="row">
                                                    <div className="col-6 mb-3">
                                                        <label className="form-label text-secondary fw-semibold">Expiry Date</label>
                                                        <input type="text" className="form-control" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} required disabled={loading} />
                                                    </div>
                                                    <div className="col-6 mb-3">
                                                        <label className="form-label text-secondary fw-semibold">CVV</label>
                                                        <input type="password" className="form-control" maxLength="3" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} required disabled={loading} />
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label text-secondary fw-semibold">Card Holder Name</label>
                                                    <input type="text" className="form-control" placeholder="John Doe" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required disabled={loading} />
                                                </div>
                                            </>
                                        )}

                                        {method === 'UPI' && (
                                            <div className="mb-4">
                                                <label className="form-label text-secondary fw-semibold">UPI ID</label>
                                                <input type="text" className="form-control" placeholder="username@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} required disabled={loading} />
                                            </div>
                                        )}

                                        <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm" disabled={loading}>
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...</>
                                            ) : (
                                                `Pay ₹ ${totalPrice.toLocaleString("en-IN")}`
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
