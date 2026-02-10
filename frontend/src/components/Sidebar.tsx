import { NavLink} from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationProvider";
import useApiCalls from "@/services/apicalls";

type props = {
    closeSidebar: () => void ;
};

export default function Sidebar({closeSidebar}: props){
    const {isAuthenticated} = useAuthentication();
    const {logout} = useApiCalls();

    return (
        <div className="flex flex-col justify-start items-end relative min-h-svh" >
        <button className="btn ghost-btn text-right px-2 py-0.5 mt-1 mr-1 mb-2" title="Close" aria-label="close-sidebar" onClick={()=> closeSidebar()}>X</button>
        <nav className=" flex flex-col gap-4 text-sm md:text-md text-white font-semibold w-full">
            <NavLink to="/" className={({isActive}) => isActive ? "bg-blue-300 dark:bg-blue-800 px-2" : "hover:bg-blue-300 hover:dark:bg-blue-800 px-2"}>Home</NavLink>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? "bg-blue-300 dark:bg-blue-800 px-2" : "hover:bg-blue-300 hover:dark:bg-blue-800 px-2"}>Dashboard</NavLink>
            {!isAuthenticated ? 
            (
            <>
            <NavLink to="/login" className={({isActive}) => isActive ? "bg-blue-300 dark:bg-blue-800 px-2" : "hover:bg-blue-300 hover:dark:bg-blue-800 px-2"}>Login</NavLink>
            <NavLink to="Register" className={({isActive}) => isActive ? "bg-blue-300 dark:bg-blue-800 px-2" : "hover:bg-blue-300 hover:dark:bg-blue-800 px-2"}>Register</NavLink>
            </>
        ) : (
        <>
        <NavLink to="/addapplication" className={({isActive}) => isActive ? "bg-blue-300 dark:bg-blue-800 px-2" : "hover:bg-blue-300 hover:dark:bg-blue-800 px-2"}>Add Application</NavLink>
        <NavLink to="/profiledetails" className={({isActive}) => isActive ? "bg-blue-300 dark:bg-blue-800 px-2" : "hover:bg-blue-300 hover:dark:bg-blue-800 px-2"}>Profile</NavLink>
        </>
        )
        }
        </nav>
        {isAuthenticated && (
            <div className="flex justify-center w-full absolute bottom-0">
                <button className="btn btn-danger mb-2 px-3 text-sm" title="logout" onClick={logout}>LogOut</button>
            </div>
        )}
        </div>
    )
}