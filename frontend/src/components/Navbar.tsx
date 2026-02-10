import { NavLink} from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationProvider";
import useApiCalls from "@/services/apicalls";

export default function Navbar(){
    const {isAuthenticated} = useAuthentication();
    const {logout} = useApiCalls();

    return (
        <nav className="hidden lg:flex gap-4 text-white font-semibold justify-center items-center">
            <NavLink to="/" className={({isActive}) => isActive ? "text-gray-400" : "text-white hover:text-gray-400 transition-all duration-500 ease-in-out"}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "text-gray-400" : "text-white hover:text-gray-400 transition-all duration-500 ease-in-out"}>Dashboard</NavLink>
            {!isAuthenticated ? 
            (
            <>
            <NavLink  to="/login" className={({isActive}) => isActive ? "text-gray-400" : "text-white hover:text-gray-400 transition-all duration-500 ease-in-out"}>Login</NavLink >
            <NavLink  to="Register" className={({isActive}) => isActive ? "text-gray-400" : "text-white hover:text-gray-400 transition-all duration-500 ease-in-out"}>Register</NavLink >
            </>
        ) : (
            <>
                <NavLink to="/addapplication" className={({isActive}) => isActive ? "text-gray-400" : "text-white hover:text-gray-400 transition-all duration-500 ease-in-out"}>Add Application</NavLink >
                <NavLink to="/profiledetails" className={({isActive}) => isActive ? "text-gray-400" : "text-white hover:text-gray-400 transition-all duration-500 ease-in-out"}>Profile</NavLink >
                <button className="btn btn-danger py-0.2 text-sm " title="logout" onClick={logout}>LogOut</button>
            </>
        )
        }
        </nav> 
    )
}