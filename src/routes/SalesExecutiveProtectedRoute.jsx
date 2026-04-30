import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAuthState } from "../state/authenticatedState/authenticatedState";

const SalesExecutiveProtectedRoute = () => {
    const { isAuthenticated } = useRecoilValue(userAuthState);
    const token = sessionStorage.getItem("token");
    const isSalesExecutiveLogin = sessionStorage.getItem("isSalesExecutiveLogin") === "true";
    const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === "true";

    if (!isAuthenticated && !token) {
        return <Navigate to="/" />;
    }

    if (isSuperAdmin && isAuthenticated) {
        return <Navigate to="/sales-executive/dashboard" />;
    }

    if (isSalesExecutiveLogin) {
        return <Outlet />;
    }

    return <Navigate to="/" />;
}

export default SalesExecutiveProtectedRoute