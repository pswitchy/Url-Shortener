import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Link2, TrendingUp, Link } from "lucide-react";

interface Stats {
    totalUrls: number;
    totalAccessCount: number;
    topUrls: { short_code: string; url: string; access_count: number }[];
}

const DashboardPage = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/analytics');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Stats = await response.json();
                setStats(data);
            } catch (e: any) {
                setError(`Failed to load stats: ${e.message}`);
                console.error("Error fetching analytics:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-64" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="container mx-auto p-6">
                <Alert>
                    <AlertDescription>No statistics available at the moment.</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6" />
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Shortened URLs
                        </CardTitle>
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUrls}</div>
                        <p className="text-xs text-muted-foreground">
                            Unique URLs in the system
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Access Count
                        </CardTitle>
                        <Link className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAccessCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Combined clicks across all URLs
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top 5 Most Accessed URLs</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.topUrls.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Short Code</TableHead>
                                    <TableHead className="max-w-[300px]">Original URL</TableHead>
                                    <TableHead className="text-right">Access Count</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.topUrls.map((urlStat) => (
                                    <TableRow key={urlStat.short_code}>
                                        <TableCell className="font-medium">
                                            {urlStat.short_code}
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate">
                                            {urlStat.url}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {urlStat.access_count}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            No URLs have been accessed yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;