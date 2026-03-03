import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GuestProtectedRoute = ({ children }) => {
    const { user, role, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user || role !== 'guest') {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

export default GuestProtectedRoute;
