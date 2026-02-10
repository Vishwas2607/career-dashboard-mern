import { useNavigate } from "react-router-dom"
import JobCards from "@/components/JobCards";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useApiCalls from "../services/apicalls";
import type React from "react";
import { useState } from "react";
import Loader from "@/components/Loader";
import { AnimatePresence,motion } from "framer-motion";
import type { JobGetDeatilsResponse } from "@/types/ApiResponse";
import type { JobsResponseType } from "@/types/ApiResponse";

export default function Applications() {
    const navigate = useNavigate();

    const {callApi} = useApiCalls();
    const [filters, setFilters] = useState<{status:string, from:string, to: string}>({status: "", from:"", to:""});
    const [page, setPage] = useState<number>(1)

    const {data,isLoading,error} = useQuery({
        queryKey: ['savedJobs',page, filters],
        queryFn: async()=> await callApi<null | JobGetDeatilsResponse >({
            link: `jobs?page=${page}&status=${filters.status}&from=${filters.from}&to=${filters.to}`, 
            method: "GET", 
            data: null}),
        placeholderData: keepPreviousData,
    });

    const savedJobs: JobsResponseType[] = data?.jobs || [];
    
    const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.currentTarget);

        const status = formData.get("status") as string;
        const startDate = formData.get("start-date") as string;
        const endDate = formData.get("end-date") as string;

        const filter = {status: status, from: startDate, to: endDate};
        setPage(1);
        setFilters(filter);
    };

    const handleNext = () => {
        if(data.nextPage) {
            setPage(page+1);
        };
    };

    const handlePrev = () => {
        if(page >1) {
            setPage(page-1);
        };
    };

    return (
        <section title="applications" className="flex flex-col justify-center items-center w-full">
            <div className="w-full p-5 flex flex-col justify-center items-center">
            <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white/85 text-center transition-all duration-500 ease-in-out">Applications</h2>
            <div className="w-1/2 lg:w-1/3 border-3 rounded-xl border-blue-500"></div>
            </div>
            <button className="font-bold text-sm md:text-md w-[80%] md:w-[90%] bg-white dark:bg-white/90 dark:hover:bg-gray-300 text-blue-700 rounded-xl hover:text-red-500 hover:bg-gray-100 transition-all duration-500 ease-in-out" title="add-application" onClick={()=>navigate("/addapplication")}>Add New Application +</button>

            <div className="w-full mt-10">
            <div className="w-full p-5 flex flex-col items-start ">
            <h3 className="ml-1 text-lg md:text-xl font-bold text-black dark:text-white/85 text-center transition-all duration-500 ease-in-out">All Applications</h3>
            <div className="w-50 border-3 rounded-xl border-blue-500"></div>
            </div>
            </div>
            <div className="flex bg-gray-200 w-full dark:bg-gray-800 dark:border-gray-500 border-t-2 border-b-2 justify-center items-start p-2 flex-col transition-all duration-300 ease-in-out">
                <h4 className="text-md md:text-lg font-semibold text-black dark:text-white/85 text-center transition-all duration-500 ease-in-out">Fiter By: </h4>
                <form className="flex flex-wrap gap-5 text-sm md:text-md dark:text-white/90 text-black transition-all duration-500 justify-start md:justify-center mt-4 md:mt-0 items-center" onSubmit={(event)=> handleFilter(event)}>
                    <label htmlFor="status">Status: 
                    <select name="status" className="select bg-white dark:bg-gray-700">
                        <option value="">All</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interview</option>
                        <option value="offered">Offers</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    </label>
                    <label htmlFor="start-date">From : 
                        <input type="date" name="start-date" title="start-date" className="ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
                    </label>
                    <label htmlFor="end-date"> To: 
                        <input type="date" name="end-date" title="end-date" className="ml-2 input bg-blue-100 dark:bg-gray-400 dark:border-gray-400"/>
                    </label>

                    <div className="flex gap-5">
                    <button className="btn btn-primary" type="submit">Apply Filters</button>
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => {
                            setPage(1);
                            setFilters({ status: "", from: "", to: "" })}}>Clear Filters</button>
                    </div>
                </form>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-5 w-[90%]">
                {isLoading && <Loader/> }
                <AnimatePresence>
                {!isLoading && !error && savedJobs.length > 0 && (
                    savedJobs.map(job=> (
                    <motion.div 
                    key={job._id}
                    initial={{scale:0.8, opacity:0}}
                    animate={{scale:1, opacity:1}}
                    exit={{scale:0.4,opacity:0}}
                    layout
                    >
                    <JobCards jobDetail={{_id:job._id, companyName: job.companyName, role: job.role, status:job.status, location: job.location, appliedDate: job.appliedDate, jobLink:job.jobLink, notes: job.notes }}/>
                    </motion.div>
                ))
                )}
                </AnimatePresence>
            <div className="flex w-full justify-center items-center">
                {!isLoading && !error && savedJobs.length <= 0 &&  <p className="text-red-600 font-semibold dark:text-red-400 mt-10">No applications found.</p>}
                {error instanceof Error && <p className="text-red-600 font-semibold dark:text-red-400 mt-10" role="alert" aria-live="assertive">{error.message}</p>}
                {data && data.totalPages > 1 && (
                <div className="flex gap-10 justify-center items-center mt-10 mb-10">
                    <button className="btn btn-primary disabled:disabled-btn" onClick={handlePrev} disabled={page===1}>Prev</button>
                    <p>{`Page ${page} out of ${data.totalPages}`}</p>
                    <button className="btn btn-primary disabled:disabled-btn" onClick={handleNext} disabled={!data.nextPage}>Next</button>
                </div>
                )}
            </div>
            </div>
                <button className="btn btn-primary mt-10" onClick={()=> navigate(-1)}>Go back</button>
        </section>
    );
    
};