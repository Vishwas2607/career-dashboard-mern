import useApiCalls from "@/services/apicalls"
import { useTheme } from "@/context/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import type { ProfileResponse } from "@/types/ApiResponse";


export default function ProfilePage() {
    const {callApi,logout} = useApiCalls();
    const {theme} = useTheme();
    const navigate = useNavigate();

    const {data, isLoading,error} = useQuery({
        queryKey:["profile-info"],
        queryFn: async() => await callApi<null, ProfileResponse >({
            link: "profile",
            method: "GET",
            data: null,
        })
    });

    const prefersDark = window.matchMedia("prefers-color-scheme: dark").matches;
    
    return (
        <section title="Job Details" className="flex flex-col justify-center items-center w-full text-black dark:text-white/90 transition-all duration-500 ease-in-out">
            <div className="w-full p-5 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-black dark:text-white/85 text-center transition-all duration-500 ease-in-out">Your Details</h2>
            <div className="w-1/2 lg:w-1/3 border-3 rounded-xl border-blue-500"></div>
            </div>

            <div className="w-full ">
                {isLoading && !error && <Loader/>}
                {!isLoading && error && <p className="text-center text-xl font-semibold text-red-500" role="alert" aria-live="assertive">{error.message}</p>}
                {!isLoading && !error && data && (
                    <div className="flex flex-col w-full items-start">
                        <p className="px-2 text-lg underline underline-offset-5 mb-2"><strong>User Info: </strong></p>
                        <p className="w-full border-black/30 border-t-2 border-b-2 p-2 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out capitalize"><strong>Username: </strong>{data.username ? data.username : "Guest"}</p>
                        <p className="w-full border-black/30 border-b-2 p-2 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Email: </strong>{data.email}</p>
                        <p className="w-full border-black/30 border-b-2 p-2 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Total Applications: </strong>{data.totalJobs}</p>
                    </div>
                )}
            </div>
            <div className="w-full mt-10">
                <p className="px-2 text-lg underline underline-offset-5 mb-2"><strong>Theme Details: </strong></p>
                <p className="border-black/30 border-t-2 border-b-2 p-2 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Prefered Theme: </strong>{prefersDark? "Dark" : "Light"}</p>
                <p className="border-black/30 border-b-2 p-2 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Current Theme: </strong>{theme === "dark" ? "Dark" : "Light"}</p>
            </div>
            <div className="flex gap-10 mt-10 justify-center items-center">
                <button className="btn btn-primary" onClick={()=>navigate(-1)}>Go Back</button>
                <button className="btn btn-danger py-2" onClick={logout}>LogOut</button>
                
            </div>
        </section>
    )
}