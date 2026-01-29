"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Eye, ExternalLink, Github, Search, Loader2 } from "lucide-react";
import Link from "next/link";

interface Repository {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
    watchers_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
    commit_count?: number;
}

export default function GitReportPage() {
    const [username, setUsername] = useState("");
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchedUser, setSearchedUser] = useState("");

    const fetchRepos = async () => {
        if (!username.trim()) return;

        setLoading(true);
        setError(null);
        setRepos([]);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/github/repos/?username=${username}`);

            if (!response.ok) {
                throw new Error("Failed to fetch repositories. User might not exist.");
            }

            const data = await response.json();
            setRepos(data);
            setSearchedUser(username);

            fetchCommitCounts(username, data);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const fetchCommitCounts = async (user: string, repositories: Repository[]) => {
        const updatedRepos = [...repositories];

        const BATCH_SIZE = 5;
        for (let i = 0; i < repositories.length; i += BATCH_SIZE) {
            const batch = repositories.slice(i, i + BATCH_SIZE);

            await Promise.all(batch.map(async (repo) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/github/repo-commits/?username=${user}&owner=${repo.owner.login}&repo=${repo.name}`);
                    if (res.ok) {
                        const result = await res.json();
                        if (result.success) {
                            setRepos(prev => prev.map(r =>
                                r.id === repo.id ? { ...r, commit_count: result.count } : r
                            ));
                        }
                    }
                } catch (e) {
                    console.error(`Failed to fetch commits for ${repo.name}`, e);
                }
            }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            fetchRepos();
        }
    };

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Git Report</h1>
                <p className="text-muted-foreground">
                    Enter a GitHub username to view their repositories and statistics.
                </p>
            </div>

            <Card className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="GitHub Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={fetchRepos} disabled={loading || !username}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Get Report
                            </>
                        )}
                    </Button>
                </div>
                {error && (
                    <p className="mt-2 text-sm text-destructive font-medium">{error}</p>
                )}
            </Card>

            {repos.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Repositories for <span className="text-primary">{searchedUser}</span>
                        </h2>
                        <Badge variant="secondary" className="text-sm">
                            {repos.length} Repositories
                        </Badge>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {repos.map((repo) => (
                            <Card key={repo.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-xl font-bold truncate">
                                            <Link href={repo.html_url} target="_blank" className="hover:underline flex items-center gap-2">
                                                {repo.name}
                                            </Link>
                                        </CardTitle>
                                        {repo.language && (
                                            <Badge variant="outline" className="shrink-0">
                                                {repo.language}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="line-clamp-2 h-10">
                                        {repo.description || "No description available"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <div className={`w-3 h-3 rounded-full ${repo.language === 'TypeScript' ? 'bg-blue-500' :
                                                repo.language === 'JavaScript' ? 'bg-yellow-400' :
                                                    repo.language === 'Python' ? 'bg-green-500' :
                                                        repo.language === 'HTML' ? 'bg-orange-500' :
                                                            repo.language === 'CSS' ? 'bg-blue-400' :
                                                                'bg-gray-400'
                                                }`} />
                                            {repo.language || 'Unknown'}
                                        </div>
                                        <div className="text-xs">
                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                        <div className="text-sm font-medium">Your Commits</div>
                                        <div className="flex items-center gap-1">
                                            {repo.commit_count !== undefined ? (
                                                <Badge variant={repo.commit_count > 0 ? "default" : "secondary"}>
                                                    {repo.commit_count}
                                                </Badge>
                                            ) : (
                                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t pt-4 text-sm text-muted-foreground justify-between bg-muted/20">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1" title="Stars">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span>{repo.stargazers_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="Forks">
                                            <GitFork className="h-4 w-4" />
                                            <span>{repo.forks_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="Watchers">
                                            <Eye className="h-4 w-4" />
                                            <span>{repo.watchers_count}</span>
                                        </div>
                                    </div>
                                    <Link href={repo.html_url} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ExternalLink className="h-4 w-4" />
                                            <span className="sr-only">View on GitHub</span>
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
