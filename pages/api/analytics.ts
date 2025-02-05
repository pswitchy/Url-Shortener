// pages/api/analytics.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../utils/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        try {
            const client = await pool.connect();
            try {
                const totalUrlsResult = await client.query('SELECT COUNT(*) FROM short_urls');
                const totalAccessCountResult = await client.query('SELECT SUM(access_count) FROM short_urls');
                const topUrlsResult = await client.query(
                    'SELECT short_code, url, access_count FROM short_urls ORDER BY access_count DESC LIMIT 5'
                );

                const stats = {
                    totalUrls: parseInt(totalUrlsResult.rows[0].count, 10) || 0,
                    totalAccessCount: parseInt(totalAccessCountResult.rows[0].sum, 10) || 0,
                    topUrls: topUrlsResult.rows || [],
                };

                return res.status(200).json(stats);
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}