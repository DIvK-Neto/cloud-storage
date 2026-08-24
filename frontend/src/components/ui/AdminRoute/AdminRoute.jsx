import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminCheck } from './collections/adminRoute';

export const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAdminCheck();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};