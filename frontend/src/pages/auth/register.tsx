import { useState } from "react"
import { useNavigate } from "react-router-dom";
import useApiCalls from "../../services/apicalls";
import type{ RegisterResponse } from "@/types/ApiResponse";
import type { RegisterUser } from "@/types/User";
import {z} from 'zod';

export default function Register() {

    const [error,setError] = useState<string>("");
    const [showPassword,setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {callApi} = useApiCalls();
    const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[@$!%*?&]/, "Must contain one special character");

    const navigate = useNavigate();

    const registerUser = async({username,password, email}: RegisterUser ) => {
        try{
            const result = await callApi<RegisterUser,RegisterResponse>({
                link: "auth/register",
                method: "POST",
                data: {username: username, password: password, email: email}
            });

            console.log("Success:", result.message);
            navigate("/login");
        } catch(err) {
            console.error(err);
            if (err instanceof Error){ 
                setError(err.message);
            } else setError("Something went wrong");

        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);
        console.log(1234)

        const formData = new FormData(event.currentTarget);

        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const email = formData.get("email") as string;
        const cnfPassword = formData.get("cnf-password") as string;

        if (!username || !password || !email || !cnfPassword){
            setError("All fields are required!!!");
            setIsLoading(false);
            return
        };

        const passwordTest = passwordSchema.safeParse(password);

        if (!passwordTest.success) {
            setError(passwordTest.error.issues[0].message);
            setIsLoading(false);
            return
        }

        if (password !== cnfPassword){
            setError("Password and Confirm password must be same.")
            setIsLoading(false);
            return 
        }

        const sendData = {username: username, password: password, email: email};

        const result = await registerUser(sendData);
        console.log(result);

        };

    return (
        <section title="Register Form" className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col gap-5 justify-center items-center mt-10 border border-black/30 p-5 min-h-1/2 w-[80%] md:w-1/2 rounded-lg bg-white/30 dark:bg-white/10 dark:border-white/30 backdrop-blur-md shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg hover:backdrop-blur-2xl text-black dark:text-white transition-all duration-300 ease-in-out">
            <h2 className="text-xl font-bold text-black transition-all duration-500 dark:text-white">Register Account</h2>
            <form onSubmit={(event)=>handleSubmit(event)} className="flex flex-col w-full gap-5 text-black transition-all duration-500 dark:text-white">
            <label htmlFor="username" className="text-sm md:text-md">Username: 
            <input name="username" id="username" type="text" title="username" placeholder="Enter username" className="input bg-blue-100 dark:bg-gray-400 mt-1 md:mt-0 md:ml-2 dark:border-gray-400"/>
            </label>
            <label htmlFor="email" className="text-sm md:text-md">Email: 
            <input name="email" id="email" type="email" title="email" placeholder="Enter email" className="input bg-blue-100 dark:bg-gray-400 mt-1 md:mt-0 md:ml-2 dark:border-gray-400"/>
            </label>
            <label htmlFor="password" className="text-sm md:text-md">Password: 
            <input name="password" id="password" type={showPassword ? "text" : "password"} title="password" placeholder="Enter password" className="mt-1 md:mt-0 md:ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            <label htmlFor="cnf-password" className="text-sm md:text-md">Confirm Password: 
            <input name="cnf-password" id="cnf-password" type={showPassword ? "text" : "password"} title="cnf-password" placeholder="Confirm password" className="mt-1 md:mt-0 md:ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            <label htmlFor="show-password" className="text-sm md:text-md">Show Password: 
                <input type="checkbox" id="show-password" className="ml-2 w-5 h-4" name="show-password" aria-label="show-password" aria-checked={showPassword} onChange={()=> setShowPassword(!showPassword)}/>
            </label>
            {error && <p className="text-sm md:text-md text-red-600 font-semibold text-center dark:text-red-400">{error}</p>}
            <button type="submit" disabled={isLoading} title="register" className="btn btn-primary font-semibold disabled:disabled-btn">{isLoading ? "Processing..." : "Register"}</button>
            </form>
            <p className="text-sm md:text-md">Already have an account ? <a href="/login" className="dark:text-blue-300 text-blue-400 font-semibold hover:text-blue-600 transition-all duration-300 ease-in-out">Login</a></p>
            </div>
        </section>
    )
};