import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApiCalls from "@/services/apicalls";
import { useRef } from "react";
import type { JobCardType } from "@/types/JobApplication";
import type { DeleteResponse } from "@/types/ApiResponse";
import type{ JobDeatilsResponse } from "@/types/ApiResponse";

export default function JobCards({jobDetail}: {jobDetail: JobCardType}) {
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const {callApi} = useApiCalls();
    const prefetchTimer = useRef<NodeJS.Timeout| null>(null);

    const {mutate,isPending} = useMutation({
        mutationFn: async(id:string) => await callApi<null,DeleteResponse>({link:`jobs/${id}`, method:"DELETE", data:null}),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["savedJobs"]});
        },
        onError: (err) => alert(err.message)
    });

    const handleDelete = (id:string) => {
        mutate(id);
    }

    const handleEdit = (id: string) => {
        navigate(`/editapplication/${id}`)
    }

    const prefetchData = () => {
        queryClient.prefetchQuery({
            queryKey: ["jobDetail", jobDetail._id],
            queryFn: async ()=> await callApi<null, JobDeatilsResponse>({
            link: `jobs/${jobDetail._id}`,
            method: "GET",
            data: null
            }),
            staleTime: 60000,
        })
    };

    const handleMouseEnter = () => {
        prefetchTimer.current = setTimeout(()=> {
            prefetchData();
        },300)
    };

    const handleMouseLeave = () => {
        if(prefetchTimer.current) {
            clearTimeout(prefetchTimer.current);
        }
    }

    return (
        <div className="relative flex flex-wrap flex-col gap-5 justify-center items-start mt-10 border border-black/30 p-5 w-50 sm:w-full rounded-lg bg-white/30 dark:bg-white/10 dark:border-white/30 backdrop-blur-md shadow-2xl shadow-black/30 dark:shadow-white/10 dark:shadow-lg hover:backdrop-blur-2xl text-black dark:text-white/85 transition-all duration-300 ease-in-out hover:scale-105 capitalize">
            <h4 className="text-md md:text-lg font-semibold pt-5">{jobDetail.companyName}</h4>
            <div>
                <p className="text-sm md:text-md capitalize"><strong>Role: </strong>{jobDetail.role}</p>
                <p className="text-sm md:text-md capitalize"><strong>Location: </strong>{jobDetail.location}</p>
            </div>
            <p className="text-sm md:text-md"><strong>Applied Date: </strong>{new Date(jobDetail.appliedDate).toLocaleDateString()}</p>
            <StatusBadge status={jobDetail.status}/>
            <div className="flex gap-5 justify-center w-full">
                <button className="btn btn-primary px-2 md:px-4 text-sm md:text-md" onClick={()=>handleEdit(jobDetail._id)}>Edit</button>
                <button className="btn btn-danger disabled:disabled-btn text-sm md:text-md px-2 md:px-4" disabled={isPending} onClick={()=>handleDelete(jobDetail._id)}>{isPending ? "Processing..." : "Delete" }</button>
            </div>
            <div className="flex w-full justify-center text-sm md:text-md">
                <button className="btn btn-primary" onClick={()=> navigate(`/jobdetails/${jobDetail._id}`)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>View Job Details</button>
            </div>
        </div>
    )
}