export interface ApplicationData {
    companyName: string | undefined| null;
    role: string | undefined | null;
    location: string| undefined | null;
    status: string | undefined | null;
    appliedDate: Date | undefined | null;
    jobLink : string | undefined | null;
    notes: string | undefined | null;
};

export interface DetailsType {
    link: string,
    method: string,
    data: ApplicationData
} 


export interface JobCardType {
    _id: string,
    companyName: string,
    role: string,
    status: string,
    appliedDate: Date |string,
    location: string,
    jobLink: string,
    notes: string | null | undefined,
}

