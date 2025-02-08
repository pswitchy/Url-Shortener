// pages/index.tsx
import { useState, useEffect } from 'react';
import type { URLData } from '../utils/dataStore';
import Link from 'next/link';

const API_BASE_URL = '/api/shorten';

interface ShortenResult {
    type: 'shorten';
    data: URLData;
}

interface RetrieveResult {
    type: 'retrieve' | 'update' | 'stats';
    data: URLData;
}

interface DeleteResult {
    type: 'delete';
    message: string;
}

type ResultType = ShortenResult | RetrieveResult | DeleteResult | null;


const HomePage = () => {
    const [longUrl, setLongUrl] = useState('');
    const [customShortCodeInput, setCustomShortCodeInput] = useState('');
    const [expiresAtInput, setExpiresAtInput] = useState('');
    const [shortCodeRetrieve, setShortCodeRetrieve] = useState('');
    const [shortCodeUpdate, setShortCodeUpdate] = useState('');
    const [newLongUrl, setNewLongUrl] = useState('');
    const [shortCodeDelete, setShortCodeDelete] = useState('');
    const [shortCodeStats, setShortCodeStats] = useState('');
    const [result, setResult] = useState<ResultType>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(storedDarkMode);
        if (storedDarkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', String(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const clearResultError = () => {
        setResult(null);
        setError(null);
    };

    const handleResponse = async (response: Response) => {
        clearResultError();
        setLoading(false);
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            setError(message);
            throw new Error(message);
        }
        if (response.status === 204) {
            return null;
        }
        return response.json();
    };

    const postData = async (url = '', data = {}) => {
        setLoading(true);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    };

    const putData = async (url = '', data = {}) => {
        setLoading(true);
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    };

    const fetchData = async (url = '') => {
        setLoading(true);
        const response = await fetch(url);
        return handleResponse(response);
    };

    const deleteData = async (url = '') => {
        setLoading(true);
        const response = await fetch(url, { method: 'DELETE' });
        return handleResponse(response);
    };

    const shortenUrl = async () => {
        clearResultError();
        if (!longUrl) { setError("Please enter a long URL."); return; }
        try {
            const data = await postData(API_BASE_URL, {
                url: longUrl,
                customShortCode: customShortCodeInput,
                expiresAt: expiresAtInput // Send expiresAt in ISO 8601 format
            });
            setResult({ type: 'shorten', data });
        } catch (err: any) {
            let message = err.message;
            if (message.includes('410')) {
                message = "Error: Short URL has expired.";
            }
            setError(message);
            console.error("Shorten error:", err);
        }
    };

    const retrieveUrl = async () => {
        clearResultError();
        if (!shortCodeRetrieve) { setError("Please enter a short code."); return; }
        try {
            const data = await fetchData(`${API_BASE_URL}/${shortCodeRetrieve}`);
            setResult({ type: 'retrieve', data });
        } catch (err: any) {
            let message = err.message;
            if (message.includes('410')) {
                message = "Error: Short URL has expired.";
            }
            setError(message);
            console.error("Retrieve error:", err);
        }
    };

    const updateUrl = async () => {
        clearResultError();
        if (!shortCodeUpdate || !newLongUrl) { setError("Please enter short code and new long URL."); return; }
        try {
            const data = await putData(`${API_BASE_URL}/${shortCodeUpdate}`, { url: newLongUrl });
            setResult({ type: 'update', data });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
            console.error("Update error:", err);
        }
    };

    const deleteUrl = async () => {
        clearResultError();
        if (!shortCodeDelete) { setError("Please enter short code to delete."); return; }
        try {
            await deleteData(`${API_BASE_URL}/${shortCodeDelete}`);
            setResult({ type: 'delete', message: "URL deleted successfully (if it existed)." });
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
          }
          console.error("Update error:", err);
        }
    };

    const getStats = async () => {
        clearResultError();
        if (!shortCodeStats) { setError("Please enter short code for stats."); return; }
        try {
            const data = await fetchData(`${API_BASE_URL}/${shortCodeStats}/stats`);
            setResult({ type: 'stats', data });
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
            console.error("Update error:", err);
        };
    };

    const displayResult = () => {
        if (error) {
            return <p className="text-red-500 mt-4 dark:text-red-400">{error}</p>;
        }
        if (!result) return null;

        let content;
        if (result.type === 'shorten') {
            content = (
                <div className="p-4 bg-white dark:bg-dark-bg rounded-md shadow-md transition-opacity duration-300" style={{ opacity: result ? 1 : 0 }}>
                    <h3 className="text-lg font-semibold mb-2 text-primary-vibrant dark:text-primary-vibrant">Shortened URL Successful!</h3>
                    <p className="mb-1 text-gray-700 dark:text-dark-text"><span className="font-medium">Short Code:</span> <code className="bg-gray-100 dark:bg-dark-secondary dark:text-dark-text px-2 py-1 rounded">{result.data.short_code}</code></p>
                    <p className="mb-2 text-gray-700 dark:text-dark-text"><span className="font-medium">Short URL:</span> <a href={`/r/${result.data.short_code}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">{`${window.location.origin}/r/${result.data.short_code}`}</a></p>
                    <p className="mb-1 text-gray-700 dark:text-dark-text"><span className="font-medium">Original URL:</span> {result.data.url}</p>
                    {result.data.expires_at && <p className="mb-1 text-gray-700 dark:text-dark-text"><span className="font-medium">Expires At:</span> {new Date(result.data.expires_at).toLocaleString()}</p>}
                </div>
            );
        } else if (result.type === 'retrieve' || result.type === 'update' || result.type === 'stats') {
            content = (
                <div className="p-4 bg-white dark:bg-dark-bg rounded-md shadow-md transition-opacity duration-300" style={{ opacity: result ? 1 : 0 }}>
                    <h3 className="text-lg font-semibold mb-2 text-secondary-vibrant dark:text-secondary-vibrant">{result.type.charAt(0).toUpperCase() + result.type.slice(1)} URL Successful!</h3>
                    {Object.entries(result.data).map(([key, value]) => (
                        <p key={key} className="mb-1 text-gray-700 dark:text-dark-text"><span className="font-medium">{key}:</span> {String(value)}</p>
                    ))}
                </div>
            );
        } else if (result.type === 'delete') {
            content = <p className="text-green-600 font-semibold dark:text-green-400">{result.message}</p>;
        }

        return <div id="result" className="mt-6">{content}</div>;
    };


    return (
        <div className="min-h-screen py-10 flex flex-col items-center justify-start bg-gradient-to-br from-neutral-light to-white dark:from-dark-bg dark:to-gray-900 transition-colors duration-300">
            <button
                onClick={toggleDarkMode}
                className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M13.5 15.75a3 3 0 10-5.372-5.372 3 3 0 005.372 5.372z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                )}
            </button>

            <header className="mb-8 text-center relative">
              <h1 className="text-3xl font-bold text-primary-vibrant dark:text-primary-vibrant mb-2">URL Shortener</h1>
              <p className="text-gray-600 dark:text-dark-secondary">Simplify your links with style.</p>
            </header>
            <div className="absolute top-6 right-12">
              <Link href="/dashboard" legacyBehavior>
                <a className="text-blue-500 hover:text-blue-700 hover:underline p-2 m-2 transition-colors duration-300">Dashboard</a>
              </Link>
            </div>    
            <main className="container px-6 md:px-0 max-w-2xl w-full">
                <section className="mb-8 p-6 bg-white dark:bg-dark-bg rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-secondary-vibrant dark:text-secondary-vibrant">Shorten Your Link</h2>
                    <div className="mb-4">
                        <label htmlFor="longUrl" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Long URL:</label>
                        <input
                            type="text"
                            id="longUrl"
                            placeholder="Enter URL to shorten"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="customShortCode" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Custom Short Code (Optional):</label>
                        <input
                            type="text"
                            id="customShortCode"
                            placeholder="Enter custom short code"
                            value={customShortCodeInput}
                            onChange={(e) => setCustomShortCodeInput(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="expiresAt" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Expiration Date/Time (Optional):</label>
                        <input
                            type="datetime-local"
                            id="expiresAt"
                            value={expiresAtInput}
                            onChange={(e) => setExpiresAtInput(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                        />
                    </div>
                    <button
                        onClick={shortenUrl}
                        className={`bg-primary-vibrant hover:bg-primary-vibrant-dark dark:bg-primary-vibrant dark:hover:bg-primary-vibrant-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Shortening...' : 'Shorten URL'}
                    </button>
                </section>

                <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-dark-bg rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4 text-accent-vibrant dark:text-accent-vibrant">Retrieve URL</h2>
                        <div className="mb-4">
                            <label htmlFor="shortCodeRetrieve" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Short Code:</label>
                            <input
                                type="text"
                                id="shortCodeRetrieve"
                                placeholder="Enter short code"
                                value={shortCodeRetrieve}
                                onChange={(e) => setShortCodeRetrieve(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                            />
                        </div>
                        <button
                            onClick={retrieveUrl}
                            className={`bg-secondary-vibrant hover:bg-secondary-vibrant-dark dark:bg-secondary-vibrant dark:hover:bg-secondary-vibrant-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Retrieving...' : 'Retrieve URL'}
                        </button>
                    </div>

                    <div className="p-6 bg-white dark:bg-dark-bg rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4 text-primary-vibrant dark:text-primary-vibrant">Update URL</h2>
                        <div className="mb-4">
                            <label htmlFor="shortCodeUpdate" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Short Code:</label>
                            <input
                                type="text"
                                id="shortCodeUpdate"
                                placeholder="Enter short code"
                                value={shortCodeUpdate}
                                onChange={(e) => setShortCodeUpdate(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600 mb-2"
                            />
                            <label htmlFor="newLongUrl" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">New Long URL:</label>
                            <input
                                type="text"
                                id="newLongUrl"
                                placeholder="Enter new long URL"
                                value={newLongUrl}
                                onChange={(e) => setNewLongUrl(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                            />
                        </div>
                        <button
                            onClick={updateUrl}
                            className={`bg-accent-vibrant hover:bg-accent-vibrant-dark dark:bg-accent-vibrant dark:hover:bg-accent-vibrant-dark text-neutral-dark dark:text-neutral-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update URL'}
                        </button>
                    </div>
                </section>

                <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-dark-bg rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4 text-accent-vibrant dark:text-accent-vibrant">Delete URL</h2>
                        <div className="mb-4">
                            <label htmlFor="shortCodeDelete" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Short Code:</label>
                            <input
                                type="text"
                                id="shortCodeDelete"
                                placeholder="Enter short code to delete"
                                value={shortCodeDelete}
                                onChange={(e) => setShortCodeDelete(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                            />
                        </div>
                        <button
                            onClick={deleteUrl}
                            className={`bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Deleting...' : 'Delete URL'}
                        </button>
                    </div>

                    <div className="p-6 bg-white dark:bg-dark-bg rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <h2 className="text-xl font-semibold mb-4 text-secondary-vibrant dark:text-secondary-vibrant">Get URL Stats</h2>
                        <div className="mb-4">
                            <label htmlFor="shortCodeStats" className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2">Short Code:</label>
                            <input
                                type="text"
                                id="shortCodeStats"
                                placeholder="Enter short code for stats"
                                value={shortCodeStats}
                                onChange={(e) => setShortCodeStats(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-gray-600"
                            />
                        </div>
                        <button
                            onClick={getStats}
                            className={`bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Fetching Stats...' : 'Get Stats'}
                        </button>
                    </div>
                </section>

                {displayResult()}
            </main>

            <footer className="mt-12 text-center text-gray-500 dark:text-dark-secondary">
                <p>© {new Date().getFullYear()} URL Shortener. Made with Next.js & Tailwind CSS.</p>
            </footer>
        </div>
    );
};

export default HomePage;