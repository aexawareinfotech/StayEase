import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user, role, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return null; // wait for auth check
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
