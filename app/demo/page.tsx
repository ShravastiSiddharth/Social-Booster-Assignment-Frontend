"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function DemoPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [currentTask, setCurrentTask] = useState<any>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoadingTasks(true);
        try {
            const response = await api.get("/demo-tasks/");
            if (response.data.results) {
                setTasks(response.data.results);
            }
        } catch (error) {
            toast.error("Failed to fetch demo tasks");
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
        if (!confirm("Delete this demo task?")) return;
        try {
            await api.delete(`/demo-tasks/${taskId}/`);
            toast.success("Demo task deleted");
            fetchTasks();
        } catch (error) {
            toast.error("Failed to delete task");
        }
    };

    const handleTaskSubmit = async (values: any) => {
        try {
            if (dialogMode === "create") {
                await api.post("/demo-tasks/", values);
                toast.success("Demo task created");
            } else {
                await api.put(`/demo-tasks/${currentTask.id}/`, values);
                toast.success("Demo task updated");
            }
            fetchTasks();
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error("Operation failed");
        }
    };

    const statusColors: Record<string, string> = {
        TODO: "bg-slate-500",
        IN_PROGRESS: "bg-blue-500",
        COMPLETED: "bg-green-500",
        CANCELLED: "bg-gray-400",
    };

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <Alert variant="destructive" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Demo Mode</AlertTitle>
                <AlertDescription>
                    You are using the public demo. Data is shared and may be reset.
                    <Link href="/register" className="font-bold underline ml-2">
                        Create an account
                    </Link> to save your personal tasks.
                </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Demo Tasks</h2>
                    <p className="text-muted-foreground">
                        Try out the CRUD functionality without logging in!
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={handleCreateTask}>
                        <Plus className="mr-2 h-4 w-4" /> Add Demo Task
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingTasks ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Loading demo tasks...
                                </TableCell>
                            </TableRow>
                        ) : tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No demo tasks found. Create one!
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
                                        <Badge variant="outline">{task.priority}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {task.created_at ? format(new Date(task.created_at), "MMM d, HH:mm") : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteTask(task.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
