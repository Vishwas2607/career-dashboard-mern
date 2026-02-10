import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query";
import useApiCalls from "../services/apicalls";
import Loader from "@/components/Loader";
import type { JobDeatilsResponse } from "@/types/ApiResponse";


export default function JobDetails() {
    const navigate = useNavigate();
    const params = useParams();
    const {callApi} = useApiCalls();

    const {data, isLoading, error} = useQuery({
        queryKey: ["jobDetail", params?.jobId],
        queryFn: async ()=> await callApi<null, JobDeatilsResponse>({
            link: `jobs/${params?.jobId}`,
            method: "GET",
            data: null
    })
    });


    const savedJob = data?.jobDetail;

    return (
        <section title="Job Details" className="flex flex-col justify-center items-center w-full">
            <div className="w-full p-5 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold text-black dark:text-white/85 text-center transition-all duration-500 ease-in-out">Job Details</h2>
            <div className="w-1/2 lg:w-1/3 border-3 rounded-xl border-blue-500"></div>
            </div>

            {isLoading && <Loader/>}
            {error && <p className="text-red-600 font-semibold dark:text-red-400 mt-10" role="alert" aria-live="assertive">{error.message}</p>}
            {savedJob && (
                <div className="flex flex-col gap-5 mt-5 w-full">
                <h3 className="ml-1 text-xl font-bold px-5 dark:text-white/85 transition-all duration-500 ease-in-out text-black capitalize">Company Name: {savedJob.companyName}</h3>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out capitalize"><strong>Role: </strong>{savedJob.role}</p>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out capitalize"><strong>Status: </strong>{savedJob.status}</p>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out capitalize"><strong>Location: </strong>{savedJob.location}</p>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Applied Date: </strong> {new Date(savedJob.appliedDate).toLocaleDateString()}</p>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Created At: </strong>{new Date(savedJob.createdAt).toLocaleDateString()}</p>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Last Updated At: </strong>{new Date(savedJob.updatedAt).toLocaleDateString()}</p>
                <p className="w-full border-black/30 border-t-2 border-b-2 py-2 px-5 bg-white/30 dark:border-white/30 dark:bg-black/20 backdrop-blur-md transition-all duration-500 ease-in-out"><strong>Notes: </strong>{savedJob.notes ? savedJob.notes : "No notes added."}</p>
                <p className="text-lg dark:text-white/85 transition-all duration-500 ease-in-out px-5 text-black"><strong>Job Link: </strong><a className=" text-blue-700 font-semibold hover:text-blue-800 transition-all duration-300 ease-in-out dark:text-blue-300 dark:hover:text-blue-400" target="_blank" href={savedJob.jobLink}>Click to Visit Job Site</a></p>
            </div>
            )}
            <button className="btn btn-primary mt-10" onClick={()=> navigate(-1)}>Go back</button>
        </section>
    )
}