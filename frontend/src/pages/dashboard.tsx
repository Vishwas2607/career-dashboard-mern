
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useApiCalls from "../services/apicalls";
import { BarChartComponent, PieChartComponent } from "@/components/Charts";
import Loader from "@/components/Loader";
import type { JobsResponseType } from "@/types/ApiResponse";
import type { JobUsernameResponse } from "@/types/ApiResponse";
import type { JobStatsResponse } from "@/types/ApiResponse";
import useLocalStorage from "@/hooks/useLocalStorage";

export function Dashboard() {
    const navigate = useNavigate()
    const {callApi} = useApiCalls();
    const [value] = useLocalStorage("username","");

    const {data,isLoading,error} = useQuery({
        queryKey: ['savedJobs'],
        queryFn: async()=> await callApi<null , JobUsernameResponse>({link: `jobs?page=${1}&status=${""}&from=${""}&to=${""}`, method: "GET", data: null})
    });
    let jobs: JobsResponseType[]  = data?.jobs || [];

    const {data:jobStats} = useQuery({
        queryKey: ['jobsStats'],
        queryFn: async()=> await callApi<null, JobStatsResponse>({link: "jobs/jobstats", method: "GET", data: null})
    });
    console.log(jobStats);
    const successRatio:number = jobStats?.offered ? (jobStats?.offered / jobStats?.totalApplication)*100 : 0;

    return (
        <section title="Dashboard" className="flex flex-col justify-center items-center w-full">
            <div className="w-full p-5 flex flex-col justify-center items-center">
            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white/85 text-center transition-all duration-500 ease-in-out">Dashboard</h2>
            <div className="w-1/2 lg:w-1/3 border-3 rounded-xl border-blue-500"></div>
            <p className="ml-2 w-full mt-5 text-md md:text-lg font-semibold text-black dark:text-white/85 text-left capitalize">Hii, {value ? value : "Guest"}</p>
            </div>
                <div className="w-full px-5">
                <h3 className="ml-1 text-lg md:text-xl font-bold dark:text-white/85 transition-all duration-500 ease-in-out text-black">Your Stats</h3>
                <div className="w-40 border-2 rounded-xl border-blue-500 mb-10"></div>
                </div>
            <div className="w-full grid grid-cols-2 p-5 lg:grid-cols-4 place-items-center justify-items-center gap-5">
                <div className="shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg h-30 lg:w-full w-[90%] text-center bg-linear-to-r p-5 flex flex-col justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-sm md:text-lg text-white font-semibold dark:text-white/90">Total Applications</h4>
                    <p className="text-sm md:text-lg dark:text-white/90 text-white font-semibold">{jobStats?.totalApplication ? jobStats.totalApplication : 0}</p>
                </div>
                <div className="shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg h-30 lg:w-full w-[90%] text-center bg-linear-to-r p-5 flex flex-col justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-sm md:text-lg text-white font-semibold dark:text-white/90">Interviewing</h4>
                    <p className="text-sm md:text-md dark:text-white/90 text-white font-semibold">{jobStats?.interviewing ? jobStats.interviewing : 0}</p>
                </div>
                <div className="shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg h-30 lg:w-full w-[90%] text-center bg-linear-to-r p-5 flex flex-col justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-sm md:text-lg text-white font-semibold dark:text-white/90">Offers</h4>
                    <p className="text-sm md:text-md dark:text-white/90 text-white font-semibold">{jobStats?.offered ? jobStats.offered : 0}</p>
                </div>
                <div className="shadow-2xl border-black shadow-black/30 dark:shadow-white/10 dark:shadow-lg h-30 lg:w-full w-[90%] text-center bg-linear-to-r p-5 flex flex-col justify-center items-center text-white rounded-lg from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-800 min-w-25 min-h-25 hover:scale-105 transition-all duration-500 ease-in-out ">
                    <h4 className="text-sm md:text-lg text-white font-semibold dark:text-white/90">Rejection</h4>
                    <p className="text-sm md:text-md dark:text-white/90 text-white font-semibold">{jobStats?.rejected ? jobStats.rejected : 0}</p>
                </div>
            </div>

            {jobStats && jobStats?.totalApplication >0 && 
            <>
            <div className="p-5 mt-10 mb-10 bg-white/30 dark:bg-white/10 border-2 dark:border-gray-400 border-gray-700 transition-all duration-300 ease-in-out justify-items-center items-center">
                <div className="col-span-1 md:col-span-2 text-center">
                    <h3 className="text-lg md:text-xl px-2 font-bold dark:text-white/85 transition-all duration-500 ease-in-out text-black">Analytics Overview</h3>
                    <div className="border-2 rounded-xl border-blue-500 mb-10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
                <BarChartComponent data={jobStats.applicationPerMonth}/>
                <PieChartComponent data={{appliedApplication: jobStats.applied, interviewingApplication: jobStats.interviewing, offeredApplication: jobStats.offered, rejectedApplication: jobStats.rejected}}/>
                </div>
                <div className="text-md md:text-lg mt-10 text-green-600 dark:text-green-300"><strong>Success Rate: </strong>{successRatio.toFixed(2)}%</div>
            
            </div>
            </>}
                <div className="w-full px-5 mt-10">
                <h3 className="ml-1 text-lg md:text-xl font-bold dark:text-white/85 transition-all duration-500 ease-in-out text-black">Recent Applications</h3>
                <div className="w-60 border-2 rounded-xl border-blue-500 mb-10"></div>
                </div>
                <div className="w-[90%] flex flex-col justify-center items-center">
                {isLoading && <Loader/>}
                {!isLoading && error && <p role="alert" aria-live="assertive" className="text-red-600 font-semibold dark:text-red-400 mt-10">{error.message}</p>}
                {!isLoading && !error && (jobs.length === 0 ? <p className="text-md md:text-lg text-red-600 font-semibold dark:text-red-400" role="alert" aria-live="polite">No applications to show.</p>  :(
                    <table className="w-full text-sm md:text-md border-2 dark:border-white/85 text-white dark:text-white/90">
                        <thead>
                            <tr className="bg-blue-400 dark:bg-blue-800 transition-all duration-500 ease-in-out">
                            <th className="border-2 border-black dark:border-white/85">Company</th>
                            <th className="border-2 border-black dark:border-white/85">Role</th>
                            <th className="border-2 border-black dark:border-white/85">Status</th>
                            <th className="border-2 border-black dark:border-white/85">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job: JobsResponseType)=> (
                                    <tr className="text-center bg-white/50 dark:bg-gray-700 text-black dark:text-white/90 capitalize" key={job._id}>
                                        <td className="border-2 border-black dark:border-white/85">{job.companyName}</td>
                                        <td className="border-2 border-black dark:border-white/85">{job.role}</td>
                                        <td className="border-2 border-black dark:border-white/85">{job.status}</td>
                                        <td className="border-2 border-black dark:border-white/85">{new Date(job.appliedDate).toLocaleDateString()}</td>    
                                    </tr>
                                )
                            )
                        }
                        </tbody>
                    </table>
                )
                
            )}</div>
            <div className="flex gap-5 md:gap-10 flex-col md:flex-row mt-10">
            <button className="btn btn-primary" onClick={()=> navigate("/applications")}>View All Applications</button>
            <button className="btn btn-primary" onClick={()=> navigate("/addapplication")}>Add Application</button>
            </div>
        </section>
    )
}