"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
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
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const getLinkClassName = (path: string) => {
        const isActive = pathname === path;
        return cn(
            "transition-colors hover:text-foreground/80 cursor-pointer",
            isActive ? "text-foreground font-bold" : "text-foreground/60"
        );
    };

    const getMobileLinkClassName = (path: string) => {
        const isActive = pathname === path;
        return cn(
            "flex items-center p-2 rounded-md transition-colors hover:bg-muted cursor-pointer",
            isActive ? "bg-muted font-bold text-foreground" : "text-foreground/70"
        );
    };

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
                                    className={getLinkClassName("/dashboard")}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/tasks"
                                    className={getLinkClassName("/tasks")}
                                >
                                    Tasks
                                </Link>
                                <Link
                                    href="/git-report"
                                    className={getLinkClassName("/git-report")}
                                >
                                    Git Report
                                </Link>
                                <Link
                                    href="/analytics"
                                    className={getLinkClassName("/analytics")}
                                >
                                    Analytics
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/demo"
                                    className={getLinkClassName("/demo")}
                                >
                                    Demo Mode
                                </Link>
                                <Link
                                    href="/git-report"
                                    className={getLinkClassName("/git-report")}
                                >
                                    Git Report
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        >
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0 bg-background text-foreground">
                        <SheetHeader>
                            <SheetTitle className="text-left">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>TaskMaster</span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col space-y-3 mt-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className={getMobileLinkClassName("/dashboard")}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/tasks"
                                        className={getMobileLinkClassName("/tasks")}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Tasks
                                    </Link>
                                    <Link
                                        href="/git-report"
                                        className={getMobileLinkClassName("/git-report")}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Git Report
                                    </Link>
                                    <Link
                                        href="/analytics"
                                        className={getMobileLinkClassName("/analytics")}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Analytics
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/demo"
                                        className={getMobileLinkClassName("/demo")}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Demo Mode
                                    </Link>
                                    <Link
                                        href="/git-report"
                                        className={getMobileLinkClassName("/git-report")}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Git Report
                                    </Link>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

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
