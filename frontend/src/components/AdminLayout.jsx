import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { adminService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../pages/AdminDashboard';
import AdminRooms from '../pages/AdminRooms';
import AdminBookings from '../pages/AdminBookings';
import AdminReports from '../pages/AdminReports';
import PaymentHistory from '../pages/PaymentHistory';
import AdminUsers from '../pages/AdminUsers';
import AdminLogs from '../pages/AdminLogs';
import ErrorBoundary from './ErrorBoundary';
import {
    FaTachometerAlt, FaBed, FaBookOpen, FaChartBar,
    FaWallet, FaSignOutAlt, FaBars, FaBell, FaTimes, FaCircle
} from 'react-icons/fa';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaTachometerAlt />, name: 'Dashboard' },
        { path: '/admin/rooms', icon: <FaBed />, name: 'Rooms Management' },
        { path: '/admin/bookings', icon: <FaBookOpen />, name: 'Bookings' },
        { path: '/admin/reports', icon: <FaChartBar />, name: 'Reports' },
        { path: '/admin/payment-history', icon: <FaWallet />, name: 'Payment History' },
        { path: '/admin/users', icon: <FaCircle />, name: 'User Management' },
        { path: '/admin/logs', icon: <FaCircle />, name: 'System Logs' }
    ];

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchNotifications();
        }
    }, [user]);

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const fetchNotifications = async () => {
        try {
            const res = await adminService.getNotifications();
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await adminService.markNotificationRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="d-flex min-vh-100 bg-light" style={{ overflowX: 'hidden' }}>
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
                    style={{ zIndex: 1040 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`position-fixed top-0 start-0 h-100 bg-dark text-white d-flex flex-column transition-all duration-300 shadow-lg ${isSidebarOpen ? 'translate-x-0' : 'translate-x-none'}`}
                style={{ width: '260px', zIndex: 1050, transform: isSidebarOpen ? 'translateX(0)' : '' }}
                id="admin-sidebar"
            >
                <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
                    <h3 className="fw-bolder fs-4 mb-0 text-white tracking-wider">StayEase <span className="text-primary">Admin</span></h3>
                    <button className="btn btn-link text-white d-md-none p-0" onClick={() => setIsSidebarOpen(false)}>
                        <FaTimes size={24} />
                    </button>
                </div>

                <div className="flex-grow-1 overflow-auto py-3">
                    <ul className="nav flex-column gap-2 px-3">
                        {menuItems.map((item) => (
                            <li className="nav-item" key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `nav-link text-white rounded-3 px-3 py-3 d-flex align-items-center gap-3 transition hover-bg-secondary fw-semibold ${isActive ? 'bg-primary shadow-sm' : ''}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={isActive ? 'text-white' : 'text-secondary'}>{item.icon}</span>
                                            {item.name}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 border-top border-secondary mt-auto">
                    <button
                        className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt /> Secure Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow-1 d-flex flex-column transition-all duration-300 admin-content" style={{ minHeight: '100vh' }}>

                {/* Admin Navbar */}
                <header className="bg-white shadow-sm sticky-top px-4 py-3 d-flex justify-content-between align-items-center z-index-1030">
                    <button className="btn btn-light d-md-none border-0 p-2 shadow-sm" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars size={20} className="text-dark" />
                    </button>
                    {!isSidebarOpen && <div className="d-md-none fw-bold fs-5 text-dark ms-3 me-auto tracking-wider">StayEase Admin</div>}

                    <div className="ms-auto d-flex align-items-center gap-4 position-relative">

                        {/* Notifications */}
                        <div className="position-relative">
                            <button
                                className="btn btn-light border-0 p-2 rounded-circle position-relative transition hover-bg-secondary"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <FaBell size={20} className="text-secondary" />
                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light border-2">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border-0 fade-in" style={{ width: '320px', right: 0, zIndex: 1060 }}>
                                    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-3">
                                        <h6 className="mb-0 fw-bold">Live Alerts <span className="ms-2 badge bg-primary">{unreadCount}</span></h6>
                                        <FaTimes className="cursor-pointer text-muted" onClick={() => setShowNotifications(false)} />
                                    </div>
                                    <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-muted small">No recent notifications.</div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif._id}
                                                    className={`p-3 border-bottom position-relative cursor-pointer transition hover-bg-light ${!notif.isRead ? 'bg-primary bg-opacity-10' : ''}`}
                                                    onClick={() => { if (!notif.isRead) handleMarkAsRead(notif._id) }}
                                                >
                                                    {!notif.isRead && <FaCircle size={8} className="text-primary position-absolute mt-1" style={{ left: '10px' }} />}
                                                    <div className={`ms-3 ${!notif.isRead ? 'fw-bold text-dark' : 'text-secondary'}`}>
                                                        <p className="mb-1 small lh-sm">{notif.message}</p>
                                                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                                                            {new Date(notif.createdAt).toLocaleString()}
                                                        </small>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="d-flex align-items-center gap-2 border-start ps-4">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '38px', height: '38px' }}>
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="d-none d-lg-block">
                                <span className="d-block fw-bold text-dark lh-1" style={{ fontSize: '0.85rem' }}>{user?.name || 'Administrator'}</span>
                                <span className="d-block text-secondary mt-1 tracking-wider text-uppercase" style={{ fontSize: '0.65rem' }}>Admin Portal</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page View Wrapper */}
                <main className="flex-grow-1 p-4 page-transition fade-in overflow-auto">
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="rooms" element={<AdminRooms />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="payment-history" element={<ErrorBoundary><PaymentHistory /></ErrorBoundary>} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="logs" element={<AdminLogs />} />
                    </Routes>
                </main>
            </div>

            <style>{`
                .admin-content {
                    min-height: 100vh;
                    padding: 20px;
                }
                .admin-main {
                    min-height: 100vh;
                }
                /* Responsive Sidebar Behaviors */
                @media (min-width: 768px) {
                    #admin-sidebar { transform: translateX(0) !important; }
                    .admin-content { margin-left: 260px; }
                    .translate-x-none { transform: translateX(-100%); }
                }
                @media (max-width: 767px) {
                    .admin-content { margin-left: 0; }
                    .translate-x-none { transform: translateX(-100%); }
                }
                
                .hover-bg-secondary:hover { background-color: rgba(255,255,255,0.1); }
                .hover-bg-light:hover { background-color: #f8f9fa !important; }
                .tracking-wider { letter-spacing: 0.05em; }
                .fade-in { animation: fadeIn 0.3s ease-in-out; }
                .cursor-pointer { cursor: pointer; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AdminLayout;
