import type { NextApiRequest, NextApiResponse } from "next";
import { urlStore } from "../../../utils/dataStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const { shortCode } = req.query;

        if(!shortCode || shortCode !== "string") {
            return res.status(400).json({message: "ShortCode is required"});
        }

        const urlData = urlStore[shortCode];

        if(!urlData) {
            return res.status(404).json({message: "URL not found"});
        }

        return res.status(200).json(urlData);
    } else {
        res.setHeader("ALLOW", "GET"); // Set the ALLOW header and return a 405 Method Not Allowed response
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}