"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    LineChart,
    Line,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
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
            console.error("Failed to fetch analytics:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    if (loading || isLoadingStats) {
        return <div className="flex h-screen items-center justify-center">Loading analytics...</div>;
    }

    if (!stats) {
        return <div className="p-8">Failed to load analytics.</div>;
    }

    const { status_breakdown, priority_distribution, trends_30days } = stats;

    const statusData = Object.keys(status_breakdown).map((key) => ({
        name: key.replace("_", " "),
        value: status_breakdown[key],
    }));

    const priorityData = Object.keys(priority_distribution).map((key) => ({
        name: key,
        value: priority_distribution[key],
    }));

    const trendsData = trends_30days.map((item: any) => ({
        name: item.date.split("-").slice(1).join("/"),
        created: item.created,
        completed: item.completed,
        efficiency: item.created > 0 ? Math.round((item.completed / item.created) * 100) : 0
    }));

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics Reports</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Task Completion Rate</CardTitle>
                        <CardDescription>
                            Tasks completed vs created over time
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                                <Line type="monotone" dataKey="created" stroke="#8884d8" name="Created" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Priority Distribution</CardTitle>
                        <CardDescription>Tasks by priority level</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" name="Tasks">
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status Breakdown</CardTitle>
                        <CardDescription>Current status of all tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
