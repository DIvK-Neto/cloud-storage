import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProtectedCheck } from './collections/protectedRoute';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useProtectedCheck();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};