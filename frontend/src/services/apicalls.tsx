import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../context/AuthenticationProvider";
import type { ApiProps } from "@/types/ApiResponse";

export default function useApiCalls(){
    const navigate = useNavigate();
    const {setAuthenticated} = useAuthentication();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const logout = async() => {
        try{
            await fetch(`${backendUrl}/api/auth/logout`,{
                method: "POST",
                credentials: "include",
            });
        } finally {
            setAuthenticated(false);
            navigate("/login");
        }
    };

    const logoutAndRedirect = () => {
        setAuthenticated(false);
        navigate("/login");
    }

     const refreshAccessToken = async (): Promise<boolean> => {
            try{
                const response = await fetch(
                    `${backendUrl}/api/auth/token/refresh`,
                    {method: "POST",
                    credentials: "include"
                    },
                );

                return response.ok;
            } catch (err) {
            return false;
        }
    };

    const callApi = async <T, R=any>({link,method = "GET", data = null}: ApiProps<T>, retry = false):Promise<R> => {

            const baseUrl = `${backendUrl}/api/${link}`;
            const isAuthRoute = link.startsWith("auth/");

            const response = await fetch(baseUrl,
                    {
                        method: method,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json" ,
                        },
                        body: data ? JSON.stringify(data): undefined,
                    },
                );

            if (response.status === 401 && !retry && !isAuthRoute){
                const refreshed = await refreshAccessToken();
                if(refreshed) {
                    return callApi({link,method,data},true);
                };

                logoutAndRedirect();

                throw new Error("Session expired. Please login again.")
            };

            if (response.status === 403) {
                logoutAndRedirect();
                throw new Error("Unauthorized.")
            }

            if (!response.ok){
                const errorData = await response.json();
                throw new Error (errorData?.message || errorData?.error || `Server error ${errorData.status}`);
            };

            return response.json();

    };

    return  {callApi,logout};

};