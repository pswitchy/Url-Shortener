import type { NextApiRequest, NextApiResponse } from "next";
import { urlStore } from "../../utils/dataStore";
import { isValidUrl } from "../../utils/urlUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { shortCode} = req.query; // Extract the short code from the request query

    if(!shortCode || typeof shortCode !== "string") {
        return res.status(400).json({message: "ShortCode is required"}); // Return a 400 Bad Request response
    }

    const urlData = urlStore[shortCode]; // Get the URL data from the data store

    if(!urlData) {
        return res.status(404).json({message: "URL not found"}); // Return a 404 Not Found response
    }

    if(req.method === "GET") {
        urlData.accessCount = (urlData.accessCount || 0) + 1; // Increment the access count
        urlStore[shortCode] = {...urlData}; // Update the URL data in the data store
        return res.status(200).json(urlData); // Return the URL data in the response
    
    } else if (req.method === "PUT") {
        try {
            const { url } = req.body; // Extract the URL from the request body
            if(!url) {
                return res.status(400).json({message: "URL is required for update"}); // Return a 400 Bad Request response
            }

            if(!isValidUrl) {
                return res.status(400).json({message: "Invalid URL format"}); // Return a 400 Bad Request response
            }

            urlData.url = url; // Update the URL in the URL data
            urlData.updatedAt = new Date().toISOString(); // Update the updatedAt field
            urlStore[shortCode] = {...urlData}; // Update the URL data in the data store

            return res.status(200).json(urlData); // Return the URL data in the response
        } catch (error) {
            console.log("Error updating URL", error); // Log the error
            return res.status(500).json({message: "Internal Server Error"}); // Return a 500 Internal Server Error response
        }
    } else  if(req.method === "DELETE") {
        delete urlStore[shortCode]; // Delete the URL data from the data store
        return res.status(204).end(); // Return a 204 No Content response
    } else {
        res.setHeader("ALLOW", "GET, PUT, DELETE"); // Set the ALLOW header
        return res.status(405).end(`Method ${req.method} Not Allowed`); // Return a 405 Method Not Allowed response
    }
}