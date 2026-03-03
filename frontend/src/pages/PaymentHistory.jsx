import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await adminService.getAllBookings();
            if (res.data.success) {
                // Filter only paid bookings
                const rawData = Array.isArray(res.data.data) ? res.data.data : [];
                const paidBookings = rawData.filter(b => b.paymentStatus === 'PAID');
                setPayments(paidBookings.reverse());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = (payment) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Blue
        doc.text("StayEase Invoice", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 196, 30, null, null, "right");

        doc.setLineWidth(0.5);
        doc.line(14, 35, 196, 35);

        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Guest Details", 14, 45);
        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text(`Name: ${payment.user?.name || 'N/A'}`, 14, 55);
        doc.text(`Booking ID: ${payment._id}`, 14, 65);

        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Stay Details", 14, 85);
        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text(`Room: ${payment.room?.type || 'Standard'} (No. ${payment.room?.roomNumber || 'N/A'})`, 14, 95);
        doc.text(`Check-in: ${new Date(payment.checkIn).toLocaleDateString()}`, 14, 105);
        doc.text(`Check-out: ${new Date(payment.checkOut).toLocaleDateString()}`, 14, 115);

        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Payment Information", 14, 135);
        doc.setFontSize(12);
        doc.setTextColor(80);
        doc.text(`Transaction ID: ${payment.transactionId || 'N/A'}`, 14, 145);
        doc.text(`Payment Method: ${payment.paymentMethod || 'N/A'}`, 14, 155);
        doc.text(`Date Paid: ${new Date(payment.updatedAt).toLocaleDateString()}`, 14, 165);

        doc.setLineWidth(0.5);
        doc.line(14, 175, 196, 175);

        // Pricing summary
        const baseAmount = Math.round(payment.totalPrice / 1.18);
        const gstAmount = payment.totalPrice - baseAmount;

        doc.setFontSize(12);
        doc.setTextColor(50);
        doc.text(`Base Amount:`, 140, 190);
        doc.text(`INR ${baseAmount.toLocaleString('en-IN')}`, 170, 190);
        doc.text(`GST (18%):`, 140, 200);
        doc.text(`INR ${gstAmount.toLocaleString('en-IN')}`, 170, 200);

        doc.setFontSize(16);
        doc.setTextColor(20, 164, 77); // Green
        doc.text(`Total Paid:`, 140, 215);
        doc.text(`INR ${payment.totalPrice.toLocaleString('en-IN')}`, 170, 215);

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Thank you for choosing StayEase!", 105, 280, null, null, "center");

        doc.save(`Invoice_${payment.transactionId || payment._id}.pdf`);
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

    const filteredPayments = payments.filter(payment => {
        return payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const currentRecords = filteredPayments.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);

    if (loading) {
        return <div className="admin-content">Loading...</div>;
    }

    if (!payments) {
        return <div className="admin-content">Loading...</div>;
    }

    return (
        <div className="container-fluid py-4 fade-in">
            <div data-aos="fade-up">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h2 className="fw-bold text-dark mb-0">Payment History</h2>
                    <a href="/admin/dashboard" className="btn btn-outline-secondary">Back to Dashboard</a>
                </div>

                {Array.isArray(payments) && payments.length > 0 ? (
                    <div className="card shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg shadow-sm"
                                        placeholder="Search by Txn ID or Name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-secondary fw-bold">Date</th>
                                            <th scope="col" className="text-secondary fw-bold">Transaction ID</th>
                                            <th scope="col" className="text-secondary fw-bold">Guest</th>
                                            <th scope="col" className="text-secondary fw-bold">Method</th>
                                            <th scope="col" className="text-secondary fw-bold">Amount</th>
                                            <th scope="col" className="text-secondary fw-bold">Status</th>
                                            <th scope="col" className="text-secondary fw-bold text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecords.map((payment) => (
                                            <tr key={payment._id}>
                                                <td className="text-muted small">
                                                    {new Date(payment.updatedAt).toLocaleDateString()}
                                                </td>
                                                <td className="font-monospace text-dark fw-bold">
                                                    {payment.transactionId || 'N/A'}
                                                </td>
                                                <td className="fw-semibold">
                                                    {payment.user?.name || 'Unknown'}
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary opacity-75">{payment.paymentMethod || 'Unknown'}</span>
                                                </td>
                                                <td className="fw-bold text-success">
                                                    ₹ {payment.totalPrice.toLocaleString("en-IN")}
                                                </td>
                                                <td>
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success">
                                                        {payment.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-primary shadow-sm hover-scale"
                                                        onClick={() => handleDownloadInvoice(payment)}
                                                    >
                                                        Download Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {currentRecords.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted py-5">
                                                    No payment records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <nav>
                                        <ul className="pagination mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="fw-bold text-muted fs-5">No payment records found</p>
                )}
            </div>
            <style>{`
                .hover-scale { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.05); }
                .fade-in { animation: fadeIn 0.4s ease-in; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .hover-scale:hover { transform: scale(1.05); }
            `}</style>
        </div>
    );
};

export default PaymentHistory;
