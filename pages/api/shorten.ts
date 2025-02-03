import { URLData, urlStore } from "../utils/dataStore";
import { isValidUrl, generateShortCode } from "../utils/urlUtils";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method) {
        try {
            const { url } = req.body; // Extract the URL from the request body

            if(!url) {
                return res.status(400).json({message: "URL is required"});
            }

            if(!isValidUrl(url)) // Check if the URL is valid
            {
                return res.status(400).json({message: "Invalid URL format"});
            }

            const shortCode = generateShortCode(6); // Generate a short code
            const id = uuidv4(); // Generate a unique ID
            const now = new Date(); // Get the current date and time

            const newUrlData: URLData = {
                id, 
                shortCode,
                url,
                createdAt: now.toISOString(), // Convert the date to a string
                updatedAt: now.toISOString(), // Convert the date to a string   
                accessCount: 0, // Initialize the access count to 0
            };

            urlStore[shortCode] = newUrlData; // Store the URL data in the data store

            return res.status(201).json(newUrlData); // Return the URL data in the response

        } catch (error) {
            console.log("Error creating short URL", error); // Log the error
            return res.status(500).json({message: "Internal Server Error"}); // Return an error response
        }
    } else {
        res.setHeader("Allow", "POST"); // Set the Allow header
        return res.status(405).end(`Method ${req.method} Not Allowed`); // Return a 405 Method Not Allowed response
    }
} 