export default function countJobs(status, lst) {
    let count = 0
    lst.forEach( job=> {
        if (job.status === status) {
            count++
        };
    });

    return count
};

export function ApplicationsPerMonth(monthYear,data=[]) {
    let count = 0
    data.forEach(job=> {
        const jobMonth = new Date(job.createdAt).toLocaleDateString().slice(2);
        if(jobMonth === monthYear){
        count++
        };
    });
    return count;
}
