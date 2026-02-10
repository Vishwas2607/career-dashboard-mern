import type { ApplicationData } from "./JobApplication";
import type { User } from "./User";

export type ApiProps<T> ={
    link: string,
    method: string ,
    data: null | T,
};

export type ApplicationMonthly = {jan:number, feb: number, mar: number, apr: number, may: number, jun: number, jul: number, aug: number, sep: number, oct: number, nov: number, dec: number}

export interface JobsResponseType {
    _id: string;
    companyName: string;
    role: string;
    location: "remote" | "onsite" | "hybrid";
    appliedDate: Date;
    status: "applied" | "interviewing" | "offered" | "rejected";
    jobLink: string;
    notes?: string | null | undefined;
    createdAt: string;
    updatedAt: string;
};

export interface JobUsernameResponse {
    username: string,
    jobs: JobsResponseType[]
}

export interface ProfileResponse {
    username: string,
    email: string,
    totalJobs: number,
}

export interface JobDeatilsResponse {
    jobDetail: JobsResponseType
}

export interface JobStatsResponse {
    totalApplication : number,
    rejected: number,
    offered: number,
    interviewing: number,
    applied: number,
    applicationPerMonth: ApplicationMonthly,
}


export interface JobGetDeatilsResponse {
    jobs: JobsResponseType[],
    nextPage: boolean,
    totalPages: number,
};

export interface DeleteResponse {
    message: string;
}

export interface GetEditJobResponse{
    jobDetail: ApplicationData;
}

export interface RegisterResponse {
    message: string,
    user: User
}

type LoginUserInfo = {name: string}

export interface LoginResponse {
    message: string;
    user: LoginUserInfo;
}

export interface DeleteResponse {
    message: string;
}