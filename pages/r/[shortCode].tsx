import { GetServerSideProps } from "next";
import { useEffect } from "react";
import dotenv from "dotenv";

dotenv.config();

interface RedirectPageProps {
    redirectUrl: string | null;
    error: string | null;
}

const RedirectPage = ({ redirectUrl, error }: RedirectPageProps) => {
    useEffect(() => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, [redirectUrl]);

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<RedirectPageProps> = async (context) => { 
    const { shortCode } = context.params as { shortCode: string };
    
    // Construct the API URL using the incoming request's host and protocol
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const host = context.req.headers.host;
    const apiUrl = `${protocol}://${host}/api/shorten/${shortCode}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    props: { redirectUrl: null, error: 'Short URL not found.' },
                };
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const originalUrl = data.url;

        if (originalUrl) {
            // Validate the URL format
            let isValidUrl = true;
            try {
                new URL(originalUrl);
            } catch (e) {
                isValidUrl = false;
            }

            if (isValidUrl) {
                return {
                    redirect: {
                        destination: originalUrl,
                        permanent: false, // Using temporary redirects for flexibility
                    },
                };
            } else {
                // Pass to client-side for redirect attempt
                return {
                    props: { redirectUrl: originalUrl, error: null },
                };
            }
        } else {
            return {
                props: { redirectUrl: null, error: 'Original URL not found in our service.' },
            };
        }
    } catch (error) {
        console.error('Redirection error:', error);
        return {
            props: { redirectUrl: null, error: 'Error occurred while trying to redirect.' },
        };
    }
};

export default RedirectPage;