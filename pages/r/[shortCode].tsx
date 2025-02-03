import { GetServerSideProps } from "next";
import dotenv from "dotenv"; // Import the dotenv module

dotenv.config();

interface RedirectPageProps {
    redirectUrl: string | null;
    error: string | null;
}

const RedirectPage = ({ redirectUrl, error }: RedirectPageProps) => { // Define the RedirectPage component
    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if(redirectUrl) {
        return null;  // Redirecting, so no need to render anything
    }

    
  return (
    <div>
      <p>Redirecting...</p> {/* Fallback in case getServerSideProps fails to redirect instantly */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<RedirectPageProps> = async (context) => { 
    const { shortCode } = context.params as { shortCode: string }; // Extract the shortCode from the context.params object
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/shorten/${shortCode}`; // Use env var or default
  
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
        return {
          redirect: {
            destination: originalUrl,
            permanent: true, // Or false for temporary redirect
          },
        };
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
  