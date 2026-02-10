import { createContext, useContext, useEffect, type ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import type{ ThemeContextType } from "@/types/Context";
import type { Theme } from "@/types/Context";

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({children}: {children: ReactNode}) {
    const prefersDark = window.matchMedia("prefers-color-scheme: dark").matches;

    const [theme,setTheme] = useLocalStorage<Theme>("theme", prefersDark ? "dark" : "light");

    useEffect(()=> {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
    },[theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    }

    return <ThemeContext.Provider value= {{theme,toggleTheme}}>
        {children}
    </ThemeContext.Provider>
};


export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) throw new Error("useTheme must be used within <ThemeProvider>");
    return context;
}