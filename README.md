# URL Shortener

A modern and vibrant URL shortening service built with Next.js, TypeScript, and Tailwind CSS. This application allows users to shorten long URLs, retrieve original URLs from short codes, update existing short URLs, delete short URLs, and get statistics on short URL usage.

## Features

- **Create Short URLs:**  Easily shorten long URLs via a simple form.
- **Retrieve Original URLs:**  Get back the original URL using a short code.
- **Update Short URLs:** Modify the original URL associated with a short code.
- **Delete Short URLs:** Remove short URLs when they are no longer needed.
- **Get URL Statistics:** View access counts and other stats for short URLs.
- **Modern and Vibrant UI:**  Built with Tailwind CSS for a clean, responsive, and visually appealing user interface.
- **Dark Mode:**  Supports both light and dark modes for user preference.
- **API Endpoints:**  RESTful API for programmatic access to URL shortening functionalities.
- **Redirection:**  Shortened URLs automatically redirect to their original destinations.
- **In-memory Data Store:**  Uses an in-memory store for simplicity (easily adaptable to a database for production).

## Technologies Used

- **Frontend:**
    - [Next.js](https://nextjs.org/) - React framework for building web applications.
    - [TypeScript](https://www.typescriptlang.org/) -  Typed superset of JavaScript.
    - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.
- **Backend (Next.js API Routes):**
    - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Serverless functions within Next.js for backend logic.
    - [TypeScript](https://www.typescriptlang.org/)
    - [uuid](https://www.npmjs.com/package/uuid) - For generating unique IDs.

## Setup Instructions

Follow these steps to run the URL Shortener application locally:

**1. Clone the Repository:**

```bash
git clone <repo-url>
cd Url-Shortener
```

**2. Install Dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Run the Development Server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This will start the Next.js development server. Open your browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints

The backend API is built using Next.js API routes and is available under the `/api/shorten` path.

**Base URL:**  `http://localhost:3000/api/shorten` (when running locally)

| Method   | Endpoint                      | Description                     | Request Body (JSON)             | Response (JSON) - Success                                                                                                                                                                                                                                                                                                | Response (JSON) - Error                                  |
| -------- | ----------------------------- | ------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `POST`   | `/api/shorten`                | Create a new short URL          | `{ "url": "long_url_here" }`     | `Status 201 Created` <br> `{ "id": "uuid", "url": "long_url_here", "shortCode": "random_code", "createdAt": "timestamp", "updatedAt": "timestamp", "accessCount": 0 }`                                                                                                                                      | `Status 400 Bad Request`: `{ "message": "Error message" }` |
| `GET`    | `/api/shorten/{shortCode}`    | Retrieve original URL           | None                            | `Status 200 OK` <br> `{ "id": "uuid", "url": "original_url_here", "shortCode": "{shortCode}", "createdAt": "timestamp", "updatedAt": "timestamp", "accessCount": incremented_count }`                                                                                                                                | `Status 404 Not Found`: `{ "message": "Short URL not found" }` |
| `PUT`    | `/api/shorten/{shortCode}`    | Update an existing short URL    | `{ "url": "new_long_url_here" }` | `Status 200 OK` <br> `{ "id": "uuid", "url": "new_long_url_here", "shortCode": "{shortCode}", "createdAt": "timestamp", "updatedAt": "updated_timestamp", "accessCount": current_count }`                                                                                                                     | `Status 400 Bad Request`: `{ "message": "Error message" }` <br> `Status 404 Not Found`: `{ "message": "Short URL not found" }` |
| `DELETE` | `/api/shorten/{shortCode}`    | Delete an existing short URL    | None                            | `Status 204 No Content`                                                                                                                                                                                                                                                                                                    | `Status 404 Not Found`: `{ "message": "Short URL not found" }` |
| `GET`    | `/api/shorten/{shortCode}/stats` | Get statistics for short URL  | None                            | `Status 200 OK` <br> `{ "id": "uuid", "url": "original_url_here", "shortCode": "{shortCode}", "createdAt": "timestamp", "updatedAt": "timestamp", "accessCount": current_count }`                                                                                                                                | `Status 404 Not Found`: `{ "message": "Short URL not found" }` |
| `GET`    | `/r/{shortCode}`              | Redirect to original URL        | None                            | `Status 301 Moved Permanently` or `Status 302 Found` (Redirects browser to the original URL)                                                                                                                                                                                                                              | `Status 404` page with "Short URL not found." message       |

**Note:** Timestamps are in ISO 8601 format.

## Usage Instructions (Frontend)

1.  **Shorten URL:**
    - Enter a long URL in the "Shorten Your Link" section and click "Shorten URL".
    - A shortened URL will be generated and displayed below.

2.  **Retrieve Original URL:**
    - Enter a short code in the "Retrieve URL" section and click "Retrieve URL".
    - The original URL and details will be shown.

3.  **Update Short URL:**
    - Enter a short code and the new long URL in the "Update URL" section and click "Update URL".
    - The short URL will be updated to point to the new long URL.

4.  **Delete Short URL:**
    - Enter a short code in the "Delete URL" section and click "Delete URL".
    - The short URL will be deleted.

5.  **Get URL Stats:**
    - Enter a short code in the "Get URL Stats" section and click "Get Stats".
    - Statistics for the short URL, including the access count, will be displayed.

6.  **Dark Mode Toggle:**
    - Use the toggle button in the top-right corner to switch between light and dark modes.

**Environment Variables (Optional):**

You can configure the base API URL for the frontend by setting the `NEXT_PUBLIC_API_BASE_URL` environment variable in Vercel's project settings if you plan to deploy the backend and frontend separately or at different domains. By default, it assumes the API is at the same domain.

## Future Enhancements

- **Database Integration:**  Replace the in-memory data store with a persistent database (e.g., PostgreSQL, MongoDB, SQLite) for production use.
- **Custom Short Codes:** Allow users to specify custom short codes.
- **Analytics Dashboard:**  Expand statistics to include more detailed analytics (e.g., geographic location, browser types, referrer information).
- **Rate Limiting:** Implement rate limiting to protect the service from abuse.
- **User Authentication:** Add user accounts and authentication for managing short URLs.
- **Link Expiration:** Allow users to set expiration dates for short URLs.
- **QR Code Generation:** Generate QR codes for short URLs.
