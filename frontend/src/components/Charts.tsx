import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ApplicationMonthly } from "@/types/ApiResponse";

export function BarChartComponent({data}: {data:ApplicationMonthly}) {

    const barChartData = [
        {month: "Jan", applications: data.jan},
        {month: "Feb", applications: data.feb},
        {month: "Mar", applications: data.mar},
        {month: "Apr", applications: data.apr},
        {month: "May", applications: data.may},
        {month: "Jun", applications: data.jun},
        {month: "Jul", applications: data.jul},
        {month: "Aug", applications: data.aug},
        {month: "Sept", applications: data.sep},
        {month: "Oct", applications: data.oct},
        {month: "Nov", applications: data.nov},
        {month: "Dec", applications: data.dec},
    ]

    const chartConfig = {
        applications:{
            label: "Applications",
            theme: {
                light: "#2563eb",
                dark: "#2243eb"
            }
        },
    } satisfies ChartConfig

    return(
        <div>
            <ChartContainer config={chartConfig} className="min-h-70 w-full border-2 border-black transition-all duration-500 ease-in-out dark:bg-gray-800 dark:border-white/30 bg-white/50 rounded-lg shadow-xl dark:shadow-md dark:shadow-white/20 shadow-black/30 backdrop-blur-2xl">
                <BarChart accessibilityLayer data={barChartData}>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray={"3 3"}/>
                    <XAxis
                    dataKey="month"
                        tickLine={false}
                    tickMargin={10}
                    tickFormatter={(value)=> value.slice(0,3)}
                    axisLine={false}
                    stroke="var(-foreground)"
                        />
                    <ChartTooltip content={<ChartTooltipContent indicator="dot" hideIndicator={true} nameKey="applications"/>}/>
                    <ChartLegend content={<ChartLegendContent nameKey="applications"/>}/>
                    <Bar dataKey='applications' fill="var(--color-applications)" radius={4}></Bar>
                </BarChart>
            </ChartContainer>
            </div>
    )
}



export function PieChartComponent({data}: {data:{appliedApplication: number, interviewingApplication: number, offeredApplication: number, rejectedApplication: number}}) {

    const pieChartData = [
        { status: "applied", visitors: data.appliedApplication, fill: "var(--color-applied)" },
        { status: "interviewing", visitors: data.interviewingApplication, fill: "var(--color-interviewing)" },
        { status: "offered", visitors: data.offeredApplication, fill: "var(--color-offered)" },
        { status: "rejected", visitors: data.rejectedApplication, fill: "var(--color-rejected)" },
    ];


    const chartConfig = {
        applied:{
            label: "Applied",
            color: "#3b82f6"
        },
        interviewing:{
            label: "Interviewing",
            color: "var(--chart-4)"
        },
        offered: {
            label: "Offered",
            color: "var(--chart-2)"
        },
        rejected:{
            label: "Rejected",
            color: "var(--chart-1)"
        }
    } satisfies ChartConfig

    return(
        <div className="w-full">
            <ChartContainer config={chartConfig} className="min-h-70 w-full border-2 transition-all duration-500 ease-in-out dark:bg-gray-800 dark:border-white/30 bg-white/50 rounded-lg shadow-xl dark:shadow-md dark:shadow-white/20 shadow-black/30 border-black backdrop-blur-2xl">
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideIndicator={true} nameKey={"status"}/>} />
                    <ChartLegend content={<ChartLegendContent nameKey={"status"}/>} />
                    <Pie data={pieChartData} dataKey={"visitors"} nameKey={"status"} stroke="var(--stroke)" strokeWidth={1}/>
                </PieChart>
            </ChartContainer>
            </div>
    )
}
