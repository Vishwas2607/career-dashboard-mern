import { useNavigate } from "react-router-dom"

export default function PageNotFound() {
    const navigate = useNavigate();
    return(
        <section title="Page Not Found" className="text-black dark:text-white/85 transition-all duration-500 ease-in-out flex justify-center flex-col gap-5 items-center h-svh pb-20">
            <h2 className="text-4xl font-semibold">404</h2>
            <p className="text-md md:text-lg text-center">Page not found, Please check url if typed manually.</p>
            <button className="btn btn-primary" aria-describedby="Navigate to home page" onClick={()=> navigate("/")}>Go Home</button>
        </section>
    )
}