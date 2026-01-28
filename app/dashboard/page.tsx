"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        } else if (isAuthenticated) {
            fetchStats();
        }
    }, [loading, isAuthenticated, router]);

    const fetchStats = async () => {
        try {
            const response = await api.get("/analytics/dashboard/");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    if (loading || isLoadingStats) {
        return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="p-8">Failed to load statistics.</div>;
    }

    const { overview, status_breakdown, priority_distribution, upcoming_tasks, trends_30days } = stats;

    // Prepare data for charts
    const statusData = Object.keys(status_breakdown).map((key, index) => ({
        name: key.replace("_", " "),
        value: status_breakdown[key],
    }));

    const priorityData = Object.keys(priority_distribution).map((key) => ({
        name: key,
        value: priority_distribution[key],
    }));

    // Format trends data for chart
    const trendsData = trends_30days.map((item: any) => ({
        name: item.date.split("-").slice(1).join("/"), // MM/DD
        created: item.created,
        completed: item.completed,
    }));

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/tasks">
                        <Button>+ New Task</Button>
                    </Link>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.total_tasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {overview.recent_tasks_7days} created this week
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.completed_tasks}</div>
                        <p className="text-xs text-muted-foreground">
                            {overview.completion_rate}% completion rate
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.in_progress_tasks}</div>
                        <p className="text-xs text-muted-foreground">
                            Keep going!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview.overdue_tasks}</div>
                        <p className="text-xs text-muted-foreground">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Charts Section */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Task Trends (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={trendsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="created" fill="#8884d8" name="Created" />
                                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Status Breakdown Section */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold">Upcoming Tasks</h4>
                            {upcoming_tasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No upcoming tasks.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {upcoming_tasks.map((task: any) => (
                                        <li key={task.id} className="flex justify-between items-center text-sm border-b pb-1 last:border-0">
                                            <span className="truncate max-w-[150px]">{task.title}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${task.days_until_due < 0 ? 'bg-red-100 text-red-800' :
                                                task.days_until_due <= 1 ? 'bg-orange-100 text-orange-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {task.days_until_due < 0 ? 'Overdue' :
                                                    task.days_until_due === 0 ? 'Today' :
                                                        `${task.days_until_due} days`}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
