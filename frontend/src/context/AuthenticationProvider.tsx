import { createContext, useContext } from "react";
import { type ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import type{ AuthenticatedType } from "@/types/Context";


const AuthenticationContext = createContext<AuthenticatedType| null>(null);

export function AuthenticationProvider ({children}: {children: ReactNode}) {
    const [isAuthenticated,setAuthenticated] = useLocalStorage("isAuthenticated", false)

    return <AuthenticationContext.Provider value = {{isAuthenticated, setAuthenticated}}>
        {children}
    </AuthenticationContext.Provider>
}

export function useAuthentication() {
    const context = useContext(AuthenticationContext);

    if(!context) throw new Error("useAuthentication must be used inside <AuthenticationProvider>");
    return context;
};