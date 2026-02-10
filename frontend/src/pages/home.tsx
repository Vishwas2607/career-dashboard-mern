import { useAuthentication } from "@/context/AuthenticationProvider";
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuthentication();

    const handleGetStarted = () => {
        if(isAuthenticated) {
            return navigate("/dashboard");
        };
        return navigate("/login");
    };

    return (
        <section title="Home section" className="flex flex-col justify-center items-center w-full">
            <div className="w-[90%] flex flex-col gap-5 justify-center items-center mt-10 p-5 rounded-xl shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg dark:text-white bg-linear-to-r from-blue-400 to-blue-700 dark:from-blue-800 dark:to-blue-950 transition-all duration-300 ease-in-out">
                <h2 className="text-xl md:text-2xl font-bold text-white dark:text-white/85 text-center transition-all duration-500 ease-in-out">Track Every Job Application in One Place</h2>
                <p className="text-sm md:text-md lg:text-lg font-semibold text-white text-center dark:text-white/85 transition-all duration-500 ease-in-out">Organize your job search and track every application from applied to hired with our Job Application Tracker</p>
                <button className="font-bold text-md w-full bg-white dark:bg-white/90 dark:hover:bg-gray-300 text-blue-700 rounded-xl hover:text-red-500 hover:bg-gray-100 transition-colors duration-500 ease-in-out animate-grow" aria-describedby="redirect to register page" onClick={handleGetStarted}>Get Started</button>
            </div>
            <div className="mt-10 w-[90%] flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold text-center dark:text-white/85 transition-all duration-500 ease-in-out text-black">Features</h3>
                <div className="w-1/2 lg:w-1/3 border-3 rounded-xl border-blue-500"></div>
                <div className="mt-10 w-full grid gap-5 grid-cols-1 lg:grid-cols-3 place-items-center justify-items-center">
                <div className="shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg w-[90%] lg:w-full h-30 bg-linear-to-r p-5 flex flex-col text-center justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-md md:text-lg text-white font-semibold dark:text-white/90">Track Applications</h4>
                    <p className="text-sm md:text-md dark:text-white/90 text-white">Track your application status live and change as you want.</p>
                </div>
                <div className="shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg h-30 lg:w-full w-[90%] text-center bg-linear-to-r p-5 flex flex-col justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-md md:text-lg text-white font-semibold dark:text-white/90">Visual Analytics</h4>
                    <p className="text-sm md:text-md dark:text-white/90 text-white">In built chart or visual analytics tool to help you analyze quickly.</p>
                </div>
                <div className="shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg w-[90%] lg:w-full text-center h-30 bg-linear-to-r p-5 flex flex-col justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-md md:text-lg text-white font-semibold dark:text-white/90">Follow-up Reminders</h4>
                    <p className="text-sm md:text-md dark:text-white/90 text-white">Reminder facilty for upcoming interviews or deadlines.</p>
                </div>
                </div>
            </div>
            <div className="mt-10 w-[90%] flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold text-center dark:text-white/85 transition-all duration-500 ease-in-out text-black">How it works</h3>
                <div className="w-1/2 lg:w-1/3 border-3 rounded-xl border-blue-500"></div>
                <div className="text-sm md:text-lg bg-blue-500 dark:bg-blue-700 w-full mt-5 rounded-tl-xl px-3 py-1 rounded-br-xl text-white dark:text-white/85">
                    <p><strong>1. Create Account: </strong> Start by creating your account.</p>
                </div>
                <div className="text-sm md:text-lg bg-blue-500 dark:bg-blue-700 w-full mt-5 rounded-tl-xl px-3 py-1 rounded-br-xl text-white dark:text-white/85">
                    <p><strong>2. Add Job Applications: </strong>Add job details like company name, role, location, status etc.</p>
                </div>
                <div className="text-sm md:text-lg bg-blue-500 dark:bg-blue-700 w-full mt-5 rounded-tl-xl px-3 py-1 rounded-br-xl text-white dark:text-white/85">
                    <p><strong>3. Track and Analyze Progress: </strong>Use our dashboard for visual analytics, with bar charts, pie charts and much more.</p>
                </div>
            </div>
        </section>
    )
};