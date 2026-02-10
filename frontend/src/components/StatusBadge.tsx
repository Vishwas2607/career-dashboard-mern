import clsx from "clsx"

export default function StatusBadge({status}:{status:string}) {
    const cls = clsx(
        "p-2 absolute top-0 right-0 text-sm md:text-md rounded-2xl shadow-lg shadow-black/30 dark:shadow-white/10 border text-md font-semibold text-white transition-all duration-500 ease-in-out dark:text-white/90",
        {
            "bg-blue-500 hover:bg-blue-600" : status === "applied",
            "bg-yellow-500 hover:bg-yellow-600" : status === "interviewing",
            "bg-green-500 hover:bg-green-600" : status === "offered",
            "bg-red-500 hover:bg-red-600": status === "rejected"
        }
    );

    const capitalStatus = status.slice(0,1).toUpperCase() + status.slice(1,);

    return (
        <div className={cls}>
            {capitalStatus}
        </div>
    )
}