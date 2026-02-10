import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import useApiCalls from "../services/apicalls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import type { ApplicationData } from "@/types/JobApplication";
import type{ DetailsType } from "@/types/JobApplication";
import type { GetEditJobResponse } from "@/types/ApiResponse";

export default function AddApplication() {

    const [error,setError] = useState<string>("");
    const navigate = useNavigate();
    const {callApi} = useApiCalls();

    const params = useParams();
    const id: string|undefined = params?.jobId;

    const isEditing: boolean = Boolean(id);
    let job: ApplicationData | undefined;
    
    const {data,isLoading,isError} = useQuery({
        queryKey: ["job",id],
        queryFn: async() => await callApi<null,GetEditJobResponse>({link:`jobs/${id}`, method:"GET", data:null}),
        enabled: isEditing && !!id,
    });

    const queryClient = useQueryClient();

    const {mutateAsync,isPending} = useMutation({
        mutationFn: async(details:DetailsType) => await callApi<ApplicationData,null>(details),
        onSuccess:() => {
            queryClient.invalidateQueries({queryKey: ["savedJobs"]});
            navigate("/applications");
        },
        onError: (err) => setError(err.message)
    });

    if(isEditing && isLoading) {
        return <div><Loader/></div>
    };

    if(data) {
        job = data.jobDetail;
    }

    if (isError) {
        return <p>Failed to load job.</p>;
    }

    if(isEditing && !isLoading && !isError && !job) {
        return <div className="text-red-600 text-center font-semibold dark:text-red-500">Job not found!</div>
    }


    const addJob = async (data: ApplicationData, form: HTMLFormElement) => {

        try {
            let details = {
                link: "jobs",
                method: "POST",
                data: data
            };

            if (isEditing) {
                details.link = `jobs/${id}`,
                details.method = "PUT"
            };

            mutateAsync(details,{
                onSuccess: () => {
                    form.reset();
                }
            });

        } catch (err) {
            console.error(err);
            if (err instanceof Error) setError(err.message);
            else setError("Something went wrong");
        };
    };

    const defaultDate = job?.appliedDate ? new Date(job?.appliedDate).toISOString().split("T")[0]: ""

    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("")
        const form = event.currentTarget;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const role = formData.get("role") as string;
        const location = formData.get("location") as string;
        const applicationDate = formData.get("application-date") as string;
        const status = formData.get("status") as string;
        const jobLink = formData.get("job-link") as string;
        const notes = formData.get("notes") as string;

        if (!companyName || !role || !jobLink ){
            setError("Company Name, Role and Job Link are required fields!!!")
            return
        };
        
        const sendData = {companyName:companyName, role: role, location:location, status: status, appliedDate: new Date(applicationDate), jobLink: jobLink, notes: notes};

        await addJob(sendData,form);
    }

    return (
        <section className="w-full bg-blue-200 dark:bg-gray-900 transition-all duration-500 ease-in-out flex flex-col min-h-screen items-center">
            <div className="flex flex-col gap-5 justify-center items-center mt-10 border border-black/30 p-5 min-h-1/2 md:w-1/2 rounded-lg bg-white/30 dark:bg-white/10 dark:border-white/30 backdrop-blur-md shadow-lg hover:backdrop-blur-2xl text-black dark:text-white transition-all duration-300 ease-in-out">
            <h2 className="text-lg md:text-xl font-bold text-black transition-all duration-500 dark:text-white">{isEditing ? "Edit Job Details" : "Add Job Details"}</h2>
            <form onSubmit={(event)=>handleSubmit(event)} className="flex flex-col flex-wrap gap-5 text-black transition-all duration-500 dark:text-white" key={id ?? "new-application"}>
            <label htmlFor="company-name" className="text-sm md:text-md">Company Name: 
            <input name="company-name" id="company-name" defaultValue={job?.companyName ?? ""} type="text" title="company-name" placeholder="Enter company name" className="input mt-2 md:mt-0 md:ml-2 bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            <label htmlFor="role" className="text-sm md:text-md">Role / Position: 
            <input name="role" id="role" type="text" defaultValue={job?.role ?? ""} title="role" placeholder="Enter role" className="input bg-blue-100 dark:bg-gray-400 ml-2 dark:border-gray-400"/>
            </label>
            <label htmlFor="location" className="text-sm md:text-md">Location:
            <select name="location" id="location" defaultValue={job?.location ?? "remote"} className="select bg-white dark:bg-gray-700">
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
            </select>
            </label>
            <label htmlFor="application-date" className="text-sm md:text-md">Application Date: 
            <input name="application-date" id="application-date" defaultValue={defaultDate} type="date" title="application-date" className="ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            <label htmlFor="status" className="text-sm md:text-md">Status:
            <select name="status" id="status" defaultValue={job?.status ?? "applied"} className="select bg-white dark:bg-gray-700">
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
            </select>
            </label>
            <label htmlFor="job-link" className="text-sm md:text-md">Job Link: 
                <input type="url" id="job-link" defaultValue={job?.jobLink ?? ""} name="job-link" title="job-link" className="ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400" placeholder="Enter job link"/>
            </label>
            <label htmlFor="notes" className="text-sm md:text-md">Notes: 
                <textarea id="notes" defaultValue={job?.notes ?? ""} name="notes" title="notes" placeholder="Enter notes..." rows={5} className="mt-2 min-h-6 w-full input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
            </label>
            {error && <p className="text-sm md:text-md text-red-600 font-semibold text-center dark:text-red-400" role="alert" aria-live="polite">{error}</p>}
            <button type="submit" title="add-job" disabled={isPending || isLoading} className="btn btn-primary font-semibold disabled:disabled-btn">{isPending ? "Processing" : (isEditing ? "Update Job" : "Add Job")}</button>
            </form>
            </div>
            <button className="btn btn-primary mt-10" onClick={()=> navigate(-1)}>Go back</button>
        </section>
    )
};