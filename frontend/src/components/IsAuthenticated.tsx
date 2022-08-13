import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { getToken } from "./manage-tokens";

const IsAuthenticated: React.FC = () => {
    const jwtToken = getToken();
    return (jwtToken == null) ? (<Navigate to="/" />) : <Outlet />;
}

export default IsAuthenticated
