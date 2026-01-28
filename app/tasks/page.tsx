"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Trash2, Edit, MoreHorizontal, Mail, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { toast } from "sonner";
import { format } from "date-fns";

export default function TasksPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [currentTask, setCurrentTask] = useState<any>(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        } else if (isAuthenticated) {
            fetchTasks();
        }
    }, [loading, isAuthenticated, router, statusFilter]);

    const fetchTasks = async () => {
        setIsLoadingTasks(true);
        try {
            let url = "/tasks/";
            const params = new URLSearchParams();
            if (statusFilter) params.append("status", statusFilter);
            if (searchTerm) params.append("search", searchTerm);

            const queryString = params.toString();
            if (queryString) url += `?${queryString}`;

            const response = await api.get(url);
            if (response.data.results) {
                setTasks(response.data.results);
            }
        } catch (error) {
            toast.error("Failed to fetch tasks");
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const handleCreateTask = () => {
        setDialogMode("create");
        setCurrentTask(null);
        setIsDialogOpen(true);
    };

    const handleEditTask = (task: any) => {
        setDialogMode("edit");
        setCurrentTask(task);
        setIsDialogOpen(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            await api.delete(`/tasks/${taskId}/`);
            toast.success("Task deleted successfully");
            fetchTasks();
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const handleSendReminder = async (taskId: string) => {
        try {
            toast.promise(api.post(`/tasks/${taskId}/send-reminder/`), {
                loading: 'Sending reminder...',
                success: 'Reminder email sent!',
                error: 'Failed to send reminder',
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleTaskSubmit = async (values: any) => {
        try {
            if (dialogMode === "create") {
                await api.post("/tasks/", values);
                toast.success("Task created successfully");
            } else {
                await api.put(`/tasks/${currentTask.id}/`, values);
                toast.success("Task updated successfully");
            }
            fetchTasks();
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const statusColors: Record<string, string> = {
        TODO: "bg-slate-500",
        IN_PROGRESS: "bg-blue-500",
        COMPLETED: "bg-green-500",
        CANCELLED: "bg-gray-400",
    };

    const priorityColors: Record<string, string> = {
        LOW: "bg-slate-400",
        MEDIUM: "bg-yellow-500",
        HIGH: "bg-orange-500",
        URGENT: "bg-red-500",
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
                    <p className="text-muted-foreground">
                        Here's a list of your tasks for this month!
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleCreateTask}>
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchTasks()}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">
                            <Filter className="mr-2 h-4 w-4" />
                            Status
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
                            <DropdownMenuCheckboxItem
                                key={status}
                                checked={statusFilter === status}
                                onCheckedChange={(checked) => setStatusFilter(checked ? status : null)}
                            >
                                {status.replace("_", " ")}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {statusFilter && (
                    <Button
                        variant="ghost"
                        onClick={() => setStatusFilter(null)}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <XCircle className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingTasks ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading tasks...
                                </TableCell>
                            </TableRow>
                        ) : tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No tasks found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>
                                        <Badge variant="outline" className={`${statusColors[task.status]} text-white border-0`}>
                                            {task.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{task.title}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {task.description}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${priorityColors[task.priority]} text-white border-0`}>
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSendReminder(task.id)}>
                                                    <Mail className="mr-2 h-4 w-4" /> Send Reminder
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => api.patch(`/tasks/${task.id}/`, { status: "COMPLETED" }).then(fetchTasks)}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={dialogMode}
                initialData={currentTask}
                onSubmit={handleTaskSubmit}
            />
        </div>
    );
}
import { XCircle } from "lucide-react";
