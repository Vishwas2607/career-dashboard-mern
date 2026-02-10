import { Navigate, Outlet } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationProvider";


export default function ProtectedRoute() {
    const {isAuthenticated} = useAuthentication();

    if(!isAuthenticated) {
        return <Navigate to="/login" replace />;
    };

    return <Outlet />
}