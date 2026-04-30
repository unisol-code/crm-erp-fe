import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAuthState } from '../state/authenticatedState/authenticatedState';

const AdminProtectedRoute = () => {
    const { isAuthenticated } = useRecoilValue(userAuthState);
    const token = sessionStorage.getItem("token");
    const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === 'true';

    if (!isAuthenticated && !token) {
        return <Navigate to="/" />;
    }

    if (!isSuperAdmin) {
        return <Navigate to="/sales-executive/dashboard" />;
    }

    if (isSuperAdmin && isAuthenticated) {
        return <Outlet />;
    }

    return <Outlet />;
}

export default AdminProtectedRoute