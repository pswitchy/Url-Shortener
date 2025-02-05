// pages/dashboard.tsx
import React, { useEffect, useState } from 'react';
import pool from './utils/db';

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
                const response = await fetch('/api/analytics'); // Create API endpoint /api/analytics
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
        return <div>Loading Dashboard...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!stats) {
        return <div>No stats available.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Total Shortened URLs</h2>
                    <p className="text-xl">{stats.totalUrls}</p>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Total URL Access Count</h2>
                    <p className="text-xl">{stats.totalAccessCount}</p>
                </div>
            </div>

            <div className="mt-8 bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-4">Top 5 Most Accessed URLs</h2>
                {stats.topUrls.length > 0 ? (
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Short Code</th>
                                <th className="text-left">Original URL</th>
                                <th className="text-left">Access Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topUrls.map((urlStat) => (
                                <tr key={urlStat.short_code}>
                                    <td className="py-1">{urlStat.short_code}</td>
                                    <td className="py-1">{urlStat.url}</td>
                                    <td className="py-1">{urlStat.access_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No URLs accessed yet.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;