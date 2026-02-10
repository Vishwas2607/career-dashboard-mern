import { useState } from "react"
import useApiCalls from "../../services/apicalls";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../context/AuthenticationProvider";
import type { LoginUser } from "@/types/User";
import type { LoginResponse } from "@/types/ApiResponse";
import useLocalStorage from "@/hooks/useLocalStorage";

export default function Login() {

    const [error,setError] = useState<string>("");
    const [showPassword,setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {callApi} = useApiCalls();
    const navigate = useNavigate();
    const {setAuthenticated} = useAuthentication();
    const [, setValue] = useLocalStorage("username", "")

    const loginUser = async (data: LoginUser) => {
        try{
            const result = await callApi<LoginUser, LoginResponse>({
                link: "auth/login",
                method: "POST",
                data: data
            });
            setValue(result.user.name);
            setAuthenticated(true);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            if (err instanceof Error){ 
                setError(err.message);
            } else setError("Something went wrong");

        } finally {
            setIsLoading(false);
        }
    }
    
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password){
            setError("All fields are required!!!")
            setIsLoading(false);
            return
        };

        const data = {email: email?.toString(), password: password?.toString()};

        const result = await loginUser(data);
        console.log(result);
    }
    return (
        <section title="Login Form" className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col gap-5 justify-center items-center mt-10 border border-black/30 p-5 min-h-1/2 w-[80%] md:w-1/2 rounded-lg bg-white/30 dark:bg-white/10 dark:border-white/30 backdrop-blur-lg shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg hover:backdrop-blur-2xl text-black dark:text-white transition-all duration-300 ease-in-out">
            <h2 className="text-lg md:text-xl font-bold text-black transition-all duration-500 dark:text-white">Enter Login Credentials</h2>
            <form onSubmit={(event)=>handleSubmit(event)} className="flex flex-wrap flex-col w-full gap-5 text-black transition-all duration-500 dark:text-white">
            <label htmlFor="email" className="text-sm md:text-md">Email: 
            <input name="email" id="email" type="text" title="email" placeholder="Enter email" className="input max-w-fit mt-1 md:mt-0 md:ml-2 bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            <label htmlFor="password" className="text-sm md:text-md">Password: 
            <input name="password" id="password" type={showPassword ? "text" : "password"} title="password" placeholder="Enter password" className="mt-1 md:mt-0 md:ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            <label htmlFor="show-password" className="text-sm md:text-md">Show Password: 
                <input type="checkbox" id="show-password" aria-checked={showPassword} className="ml-2 w-5 h-4" name="show-password" aria-label="show-password" onChange={()=> setShowPassword(!showPassword)}/>
            </label>
            {error && <p className="text-sm md:text-lg text-red-600 text-center font-semibold dark:text-red-500">{error}</p>}
            <button type="submit" disabled={isLoading} title="Login" className="btn btn-primary font-semibold disabled:disabled-btn ">{isLoading ? "Processing..." : "Login"}</button>
            </form>
            <p className="text-sm md:text-md">Forgot <a href="#" className="dark:text-blue-300 text-blue-400 hover:text-blue-600 transition-all duration-300 ease-in-out">Username / Password</a> ?</p>
            <p className="text-sm md:text-md">Don't have an account? <a href="/register" className="dark:text-blue-300 text-blue-400 font-semibold hover:text-blue-600 transition-all duration-300 ease-in-out">Sign Up</a></p>
            </div>
        </section>
    )
};