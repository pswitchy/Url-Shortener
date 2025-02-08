// pages/api/shorten.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { isValidUrl, generateShortCode } from '../../utils/urlUtils';
import pool from '../../utils/db';

const rateLimitWindowMs = 60 * 1000; // 1 minute window
const maxRequestsPerWindow = 5; // Max 5 requests per minute
const requestCounts = new Map<string, { count: number; expiry: number }>();

function applyRateLimiting(req: NextApiRequest): boolean {
    const ip = req.socket.remoteAddress || 'unknown'; // Get IP address (for basic example)
    const now = Date.now();

    const requestCount = requestCounts.get(ip) || { count: 0, expiry: now + rateLimitWindowMs };

    if (now > requestCount.expiry) {
        // Reset count if window expired
        requestCounts.set(ip, { count: 1, expiry: now + rateLimitWindowMs });
        return true; // Allow request
    }

    if (requestCount.count >= maxRequestsPerWindow) {
        return false; // Rate limit exceeded
    }

    requestCount.count++;
    requestCounts.set(ip, requestCount);
    return true; // Allow request
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        if (!applyRateLimiting(req)) {
            return res.status(429).json({ message: 'Too many requests. Please try again later.' }); // 429 Too Many Requests
        }
        try {
            const { url, customShortCode, expiresAt } = req.body; // Get expiresAt from request

            if (!url) {
                return res.status(400).json({ message: 'URL is required' });
            }
            if (!isValidUrl(url)) {
                return res.status(400).json({ message: 'Invalid URL format' });
            }

            let shortCode = customShortCode;
            if (!customShortCode) {
                shortCode = generateShortCode(6);
            } else {
                if (typeof customShortCode !== 'string' || customShortCode.length < 3 || customShortCode.length > 20) {
                    return res.status(400).json({ message: 'Custom short code must be a string between 3 and 20 characters.' });
                }
            }

            let expiresAtDate: Date | null = null;
            if (expiresAt) {
                expiresAtDate = new Date(expiresAt);
                if (isNaN(expiresAtDate.getTime())) { // Check if date is valid
                    return res.status(400).json({ message: 'Invalid expiresAt date format. Use ISO 8601 format.' });
                }
            }

            const client = await pool.connect();
            try {
                const shortCodeCheckResult = await client.query(
                    'SELECT id FROM short_urls WHERE short_code = $1',
                    [shortCode]
                );
                if (shortCodeCheckResult.rows.length > 0) {
                    if (customShortCode) {
                        return res.status(400).json({ message: 'Custom short code is already taken. Please choose another.' });
                    } else {
                        shortCode = generateShortCode(6);
                    }
                }

                const now = new Date();
                const id = uuidv4();
                const expiresAtValue = expiresAtDate ? expiresAtDate : null; // Prepare for DB query

                const result = await client.query(
                    'INSERT INTO short_urls (id, url, short_code, created_at, updated_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, url, short_code, created_at, updated_at, access_count, expires_at',
                    [id, url, shortCode, now, now, expiresAtValue]
                );

                const newURLData = result.rows[0];

                return res.status(201).json(newURLData);
            } finally {
                client.release();
            }
        } catch (error) {
            console.error('Error creating short URL:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}