import { useTheme } from "../context/ThemeProvider";
import clsx from "clsx";
import { FaSun, FaMoon } from "react-icons/fa";

export function ThemeBtn() {
    const {theme,toggleTheme} = useTheme();
    const cls = clsx(
        "bg-white p-0.5 rounded-lg absolute left-0 transition-all duration-500 ease-in-out",
        {"translate-x-5": theme === "light"}
        
    );

    return(
        <div className="w-10 h-4 flex items-center bg-gray-400 rounded-lg relative">
        <button onClick={()=> toggleTheme()} className={cls} title="Theme Switch" aria-label={theme === "light" ? "Dark Theme Switch" : "Light Theme Switch"}>
            {theme === "light" ? <FaMoon className="text-blue-400"></FaMoon>: <FaSun className="text-yellow-400"/>}
        </button>
        </div>
    )
}