export interface URLData {
    id: string;
    url: string;
    shortCode: string;
    createdAt: string;
    updatedAt: string;
    accessCount: number;
}

export const urlStore: { [key: string]: URLData } = {}; // Create an empty object to store URL data