// pages/api/shorten/[shortCode].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../utils/db';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { shortCode } = req.query;

    if (!shortCode || typeof shortCode !== 'string') {
        return res.status(400).json({ message: 'Short code is required' });
    }

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
        const expiresAt = urlData.expires_at;

        if (expiresAt) {
            const expiryDate = new Date(expiresAt);
            if (expiryDate < new Date()) {
                return res.status(410).json({ message: 'Short URL has expired' }); // 410 Gone for expired links
            }
        }

        // Increment access count in database
        await client.query(
            'UPDATE short_urls SET access_count = access_count + 1 WHERE short_code = $1',
            [shortCode]
        );

        // Refetch the updated URL data to get the latest access_count
        const updatedResult = await client.query(
            'SELECT id, url, short_code, created_at, updated_at, access_count, expires_at FROM short_urls WHERE short_code = $1',
            [shortCode]
        );
        const updatedURLData = updatedResult.rows[0];


        return res.status(200).json(updatedURLData);
    } catch (error) {
        console.error('Error retrieving short URL:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        client.release();
    }
}