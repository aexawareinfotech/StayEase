import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaUserShield, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
    const { login, logout, user, role } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (role === 'admin') navigate('/admin/dashboard', { replace: true });
            else navigate('/', { replace: true });
        }
    }, [user, role, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login({ email, password });
            if (res.success) {
                if (res.data.role !== 'admin') {
                    logout();
                    setError('Access Denied. You do not have administrator privileges.');
                } else {
                    navigate('/admin/dashboard');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
            <div className="card shadow-lg border-0 rounded-4" style={{ maxWidth: '450px', width: '100%', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="d-inline-flex bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                            <FaUserShield className="text-primary fs-1" />
                        </div>
                        <h2 className="fw-bolder text-dark mb-1">Admin Portal</h2>
                        <p className="text-muted small">StayEase Management System</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger py-2 px-3 small rounded-3 border-danger shadow-sm">
                            <FaLock className="me-2" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-3">
                            <label className="form-label text-secondary fw-bold small text-uppercase tracking-wider">Admin Email</label>
                            <input
                                type="email"
                                required
                                className="form-control form-control-lg bg-light border-0 shadow-sm"
                                placeholder="admin@stayease.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label text-secondary fw-bold small text-uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                className="form-control form-control-lg bg-light border-0 shadow-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg w-100 fw-bold rounded-pill shadow hover-scale transition"
                            style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)' }}
                        >
                            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <span className="small text-muted" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>&larr; Return to public site</span>
                    </div>
                </div>
            </div>
            <style>{`
                .hover-scale { transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
                .hover-scale:hover { transform: scale(1.02); }
                .tracking-wider { letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
};

export default AdminLogin;
