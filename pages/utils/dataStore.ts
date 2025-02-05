// utils/dataStore.ts

export interface URLData {
    id: string;
    url: string;
    short_code: string;
    created_at: string; // or Date if you prefer to work with Date objects directly in your code
    updated_at: string; // or Date
    access_count: number;
    expires_at: string | null; // or Date | null
}

// In-memory data store is REMOVED
// We are now using PostgreSQL database instead.

// No need to export urlStore anymore