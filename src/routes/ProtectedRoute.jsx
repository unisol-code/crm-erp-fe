import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAuthState } from '../state/authenticatedState/authenticatedState';

const ProtectedRoute = () => {
    const isAuthenticated = useRecoilValue(userAuthState).isAuthenticated;
    const token = sessionStorage.getItem("token");

    if (!isAuthenticated && !token) {
        return <Navigate to="/" />;
    }

    return (
        <Outlet />
    );
};

export default ProtectedRoute; 