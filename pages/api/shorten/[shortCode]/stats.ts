// pages/api/shorten/[shortCode]/stats.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../utils/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { shortCode } = req.query;

        if (!shortCode || typeof shortCode !== 'string') {
            return res.status(400).json({ message: 'Short code is required' });
        }

        try {
            const client = await pool.connect();
            try {
                const result = await client.query(
                    'SELECT id, url, short_code, created_at, updated_at, access_count, expires_at FROM short_urls WHERE short_code = $1',
                    [shortCode]
                );

                if (result.rows.length === 0) {
                    return res.status(404).json({ message: 'Short URL not found' });
                }

                const urlData = result.rows[0];

                return res.status(200).json(urlData);

            } finally {
                client.release();
            }
        } catch (error) {
            console.error('Error fetching URL statistics:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}