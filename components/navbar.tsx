"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, User, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <LayoutDashboard className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            TaskMaster
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/tasks"
                                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                                >
                                    Tasks
                                </Link>
                                <Link
                                    href="/git-report"
                                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                                >
                                    Git Report
                                </Link>
                                <Link
                                    href="/analytics"
                                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                                >
                                    Analytics
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/demo"
                                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                                >
                                    Demo Mode
                                </Link>
                                <Link
                                    href="/git-report"
                                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                                >
                                    Git Report
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Mobile Menu Trigger could go here */}

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search could go here */}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <ModeToggle />

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/01.png" alt={user?.username} />
                                            <AvatarFallback>{user?.first_name?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
