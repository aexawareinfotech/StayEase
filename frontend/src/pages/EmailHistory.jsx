import React, { useEffect, useState } from 'react';
import { emailService } from '../services/api';
import { FaEnvelope, FaEnvelopeOpenText } from 'react-icons/fa';

const EmailHistory = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const res = await emailService.getMyEmails();
                if (res.data.success) {
                    setEmails(res.data.data);
                }
            } catch (err) {
                setError('Failed to fetch emails');
            } finally {
                setLoading(false);
            }
        };
        fetchEmails();
    }, []);

    if (loading) return <div className="min-vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;
    if (error) return <div className="min-vh-100 d-flex justify-content-center align-items-center"><div className="text-danger fw-bold">{error}</div></div>;

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container" data-aos="fade-up">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <FaEnvelopeOpenText size={32} className="text-primary" />
                    <h2 className="fw-bolder mb-0">Email History</h2>
                </div>

                {emails.length === 0 ? (
                    <div className="text-center bg-white p-5 rounded-4 shadow-sm">
                        <FaEnvelope size={40} className="text-muted mb-3 opacity-50" />
                        <h4 className="text-secondary fw-bold">No emails found</h4>
                        <p className="text-muted mb-0">You haven't received any automated emails yet.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {emails.map((email) => (
                            <div key={email._id} className="col-12 col-md-6 col-lg-4" data-aos="fade-up">
                                <div className="card h-100 border-0 shadow-sm rounded-4 hover-scale transition bg-white">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3 text-muted small pb-2 border-bottom">
                                            <span className="fw-bold tracking-wider text-uppercase text-primary">{email.type.replace('_', ' ')}</span>
                                            <span>{new Date(email.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h5 className="card-title fw-bold text-dark">{email.subject}</h5>
                                        <p className="text-sm text-secondary mb-3">To: {email.email}</p>
                                        <div className="bg-light p-3 rounded-3 mt-3">
                                            <p className="card-text text-secondary mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                                                {email.message}
                                            </p>
                                        </div>
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

export default EmailHistory;
