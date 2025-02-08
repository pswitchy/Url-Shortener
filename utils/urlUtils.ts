export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}

export function generateShortCode(length: number): string {
    const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let shortCode = '';

    const values = new Uint32Array(length);
    crypto.getRandomValues(values);

    for(let i = 0; i < length; i++) {
        shortCode += charSet[values[i] % charSet.length]; // Get a character from the character set
    }
    return shortCode;
}