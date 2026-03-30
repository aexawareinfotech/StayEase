import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../services/api';
import { BookingContext } from '../context/BookingContext';
import { FaMobileAlt, FaBuilding, FaCreditCard, FaRegCreditCard } from 'react-icons/fa';
import { QRCodeSVG as QRCode } from "qrcode.react";

const cardRegex = /^[0-9]{16}$/;
const cvvRegex = /^[0-9]{3}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
const upiRegex = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{3,}$/;
const nameRegex = /^[a-zA-Z\s]{3,}$/;

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

    const [isFlipped, setIsFlipped] = useState(false);
    const [countdown, setCountdown] = useState(120);

    useEffect(() => {
        let timer;
        if (method === 'UPI' && isUpiValid) {
            timer = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [method, upiId]);

    const handleCardChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        let formatted = val.replace(/(.{4})/g, '$1 ').trim();
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length > 2) {
            val = val.substring(0, 2) + '/' + val.substring(2, 4);
        }
        setExpiry(val);
    };

    const rawCardNumber = cardNumber.replace(/\D/g, '');
    const isCardValid = cardRegex.test(rawCardNumber);
    const isCvvValid = cvvRegex.test(cvv);
    const isExpiryValid = expiryRegex.test(expiry);
    const isNameValid = nameRegex.test(cardHolder.trim());
    const isUpiValid = upiRegex.test(upiId);

    const getCardType = () => {
        if (rawCardNumber.startsWith('4')) return 'Visa';
        if (/^5[1-5]/.test(rawCardNumber)) return 'Mastercard';
        return 'Card';
    };

    const isButtonDisabled = loading ||
        (method === "UPI" && !isUpiValid) ||
        (method !== "UPI" && (!isCardValid || !isCvvValid || !isExpiryValid || !isNameValid));

    const handlePayment = async (e) => {
        e.preventDefault();

        if (method !== 'UPI') {
            if (!isCardValid || !isCvvValid || !isExpiryValid || !isNameValid) {
                setError('Please ensure all card details are correctly filled out.');
                return;
            }
        } else {
            if (!isUpiValid) {
                setError('Please enter a valid UPI ID (example: name@bank)');
                return;
            }
        }

        setError('');
        setLoading(true);

        const txnId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

        setTimeout(async () => {
            try {
                const res = await bookingService.payBooking(bookingId, method, txnId);
                if (res.data.success) {
                    clearBookingDetails();
                    navigate(`/payment-confirmation/${bookingId}`, {
                        state: {
                            transactionId: txnId,
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

    const upiLink = `upi://pay?pa=stayease@upi&pn=StayEaseHotel&am=${totalPrice}&cu=INR&tn=RoomBookingPayment`;

    return (
        <div className="bg-light min-vh-100 py-5 font-sans" style={{ background: 'linear-gradient(135deg, #f6f8fd 0%, #f1f5f9 100%)' }}>
            <div className="container" data-aos="fade-up">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg border-0 rounded-4 glass-card">
                            <div className="card-header bg-transparent text-center border-0 pt-5 pb-3">
                                <h2 className="fw-bold text-dark mb-0">Secure Payment</h2>
                                <p className="text-muted mt-2">Complete your booking for ₹ {totalPrice.toLocaleString("en-IN")}</p>
                            </div>

                            <div className="card-body px-5 pb-5">
                                {error && <div className="alert alert-danger rounded-3">{error}</div>}

                                <div className="d-flex gap-3 mb-4 justify-content-center flex-wrap">
                                    <div
                                        className={`p-3 border rounded-3 cursor-pointer d-flex flex-column align-items-center transition hover-scale shadow-sm flex-fill ${method === 'Credit Card' ? 'border-primary bg-primary bg-opacity-10 shadow' : 'border-secondary-subtle bg-white'}`}
                                        onClick={() => setMethod('Credit Card')}
                                        style={{ cursor: 'pointer', minWidth: '110px' }}
                                    >
                                        <FaCreditCard className="text-primary fs-3 mb-2" />
                                        <span className="fw-bold small">Credit Card</span>
                                    </div>

                                    <div
                                        className={`p-3 border rounded-3 cursor-pointer d-flex flex-column align-items-center transition hover-scale shadow-sm flex-fill ${method === 'Debit Card' ? 'border-primary bg-primary bg-opacity-10 shadow' : 'border-secondary-subtle bg-white'}`}
                                        onClick={() => setMethod('Debit Card')}
                                        style={{ cursor: 'pointer', minWidth: '110px' }}
                                    >
                                        <FaRegCreditCard className="text-primary fs-3 mb-2" />
                                        <span className="fw-bold small">Debit Card</span>
                                    </div>

                                    <div
                                        className={`p-3 border rounded-3 cursor-pointer d-flex flex-column align-items-center transition hover-scale shadow-sm flex-fill ${method === 'UPI' ? 'border-primary bg-primary bg-opacity-10 shadow' : 'border-secondary-subtle bg-white'}`}
                                        onClick={() => { setMethod('UPI'); setCountdown(120); }}
                                        style={{ cursor: 'pointer', minWidth: '110px' }}
                                    >
                                        <FaMobileAlt className="text-primary fs-3 mb-2" />
                                        <span className="fw-bold small">UPI</span>
                                    </div>
                                </div>

                                {method && (
                                    <form onSubmit={handlePayment} className="mt-4 fade-in">

                                        {(method === 'Credit Card' || method === 'Debit Card') && (
                                            <>
                                                {/* Credit Card Animation */}
                                                <div className="card-container mb-4 mx-auto" style={{ perspective: '1000px', width: '300px', height: '180px' }}>
                                                    <div className={`cc-card w-100 h-100 position-relative ${isFlipped ? 'flip' : ''}`} style={{ transition: 'transform 0.6s', transformStyle: 'preserve-3d' }}>

                                                        {/* Front Side */}
                                                        <div className="cc-front position-absolute w-100 h-100 rounded-4 p-3 text-white shadow-lg d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', backfaceVisibility: 'hidden' }}>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="fw-bold fst-italic">{getCardType()}</span>
                                                                <FaCreditCard size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="font-monospace fs-5 tracking-widest mb-2">{cardNumber || '**** **** **** ****'}</div>
                                                                <div className="d-flex justify-content-between">
                                                                    <div className="d-flex flex-column">
                                                                        <span className="small opacity-75" style={{ fontSize: '0.65rem' }}>Card Holder</span>
                                                                        <span className="fw-semibold text-truncate" style={{ maxWidth: '150px' }}>{cardHolder || 'JOHN DOE'}</span>
                                                                    </div>
                                                                    <div className="d-flex flex-column text-end">
                                                                        <span className="small opacity-75" style={{ fontSize: '0.65rem' }}>Expires</span>
                                                                        <span className="fw-semibold">{expiry || 'MM/YY'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Back Side */}
                                                        <div className="cc-back position-absolute w-100 h-100 rounded-4 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                                            <div className="w-100 bg-dark mt-4" style={{ height: '40px' }}></div>
                                                            <div className="px-3 mt-3 text-end">
                                                                <span className="d-block small opacity-75" style={{ fontSize: '0.65rem' }}>CVV</span>
                                                                <div className="bg-white text-dark rounded px-2 py-1 d-inline-block fw-bold font-monospace" style={{ minWidth: '40px' }}>{cvv || '***'}</div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label text-secondary fw-semibold">Card Number</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control shadow-sm ${cardNumber.length > 0 ? (isCardValid ? 'is-valid border-success' : 'is-invalid border-danger') : ''}`}
                                                        placeholder="1234 5678 1234 5678"
                                                        value={cardNumber}
                                                        onChange={handleCardChange}
                                                        onFocus={() => setIsFlipped(false)}
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary fw-semibold">Card Holder Name</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control shadow-sm ${cardHolder.length > 0 ? (isNameValid ? 'is-valid border-success' : 'is-invalid border-danger') : ''}`}
                                                        placeholder="John Doe"
                                                        value={cardHolder}
                                                        onChange={(e) => setCardHolder(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                                                        onFocus={() => setIsFlipped(false)}
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-6 mb-4">
                                                        <label className="form-label text-secondary fw-semibold">Expiry Date</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control shadow-sm ${expiry.length > 0 ? (isExpiryValid ? 'is-valid border-success' : 'is-invalid border-danger') : ''}`}
                                                            placeholder="MM/YY"
                                                            value={expiry}
                                                            onChange={handleExpiryChange}
                                                            onFocus={() => setIsFlipped(false)}
                                                            required
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                    <div className="col-6 mb-4">
                                                        <label className="form-label text-secondary fw-semibold">CVV</label>
                                                        <input
                                                            type="password"
                                                            className={`form-control shadow-sm ${cvv.length > 0 ? (isCvvValid ? 'is-valid border-success' : 'is-invalid border-danger') : ''}`}
                                                            maxLength="3"
                                                            placeholder="123"
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                                            onFocus={() => setIsFlipped(true)}
                                                            onBlur={() => setIsFlipped(false)}
                                                            required
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {method === 'UPI' && (
                                            <div className="mb-4 text-center">
                                                <label className="form-label text-secondary fw-semibold text-start w-100">UPI ID</label>
                                                <input
                                                    type="text"
                                                    className={`form-control shadow-sm mb-3 ${upiId.length > 0 ? (isUpiValid ? 'is-valid border-success' : 'is-invalid border-danger') : ''}`}
                                                    placeholder="username@bank"
                                                    value={upiId}
                                                    onChange={(e) => setUpiId(e.target.value.replace(/\s/g, '').toLowerCase())}
                                                    required
                                                    disabled={loading}
                                                />
                                                {upiId.length > 0 && !isUpiValid && (
                                                    <small className="text-danger mt-1 d-block text-start mb-3">
                                                        Enter valid UPI (example: rahul@oksbi)
                                                    </small>
                                                )}

                                                {isUpiValid && (
                                                    <div className="border border-success rounded-4 p-4 mt-3 bg-success bg-opacity-10 shadow-sm fade-in d-inline-block">
                                                        <h6 className="fw-bold text-success mb-3">Scan QR to Pay</h6>
                                                        <div className="bg-white p-2 rounded shadow-sm d-inline-block mb-3 mx-auto">
                                                            <QRCode
                                                                value={upiLink}
                                                                size={220}
                                                                level="H"
                                                            />
                                                        </div>
                                                        <div className="fw-bold text-dark font-monospace mb-3">{upiId}</div>
                                                        <a href={upiLink} className="btn btn-success d-block mb-3 fw-bold rounded-pill">
                                                            Pay via UPI App
                                                        </a>
                                                        <div className="badge bg-danger p-2 fs-6">
                                                            Time remaining: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow hover-scale transition mb-2"
                                            disabled={isButtonDisabled || (method === 'UPI' && countdown === 0)}
                                            style={{ background: 'linear-gradient(to right, #2563eb, #3b82f6)', border: 'none' }}
                                        >
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...</>
                                            ) : (
                                                `Pay ₹ ${totalPrice.toLocaleString("en-IN")}`
                                            )}
                                        </button>
                                        {isButtonDisabled && method && !loading && (
                                            <p className="text-center text-muted small mt-2">Please fill in all details correctly to enable payment.</p>
                                        )}
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
                .hover-scale { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.02); }
                .fade-in { animation: fadeIn 0.4s ease-in; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .is-valid.border-success { border-color: #198754 !important; }
                .is-invalid.border-danger { border-color: #dc3545 !important; }
                .cc-card.flip { transform: rotateY(180deg); }
                .tracking-widest { letter-spacing: 0.1em; }
            `}</style>
        </div>
    );
};

export default PaymentPage;
