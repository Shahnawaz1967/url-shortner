# Custom URL Shortener API

## Overview

The Custom URL Shortener API is designed to simplify the sharing of long URLs by generating short, easy-to-share links. The API includes advanced analytics, JWT-based user authentication, and categorization of links under specific topics, offering comprehensive insights into URL performance.

---

## Features

1. **User Authentication**:
   - User registration and login using JWT-based authentication.
2. **Create Short URL**:

   - Generate short URLs with optional custom aliases.
   - Group URLs under specific topics (e.g., acquisition, activation, retention).

3. **Redirect Short URL**:

   - Redirect to the original URL using the short URL alias.
   - Track user engagement with analytics for every redirect.

4. **Detailed Analytics**:

   - Retrieve analytics for individual URLs, topic-based URLs, and all URLs created by a user.
   - Track total clicks, unique clicks, operating system, and device usage.

5. **Rate Limiting**:

   - Prevent abuse by restricting the number of short URLs a user can create within a specific timeframe.

---

## Technical Details

### Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB (with Mongoose ORM)
- **Authentication**: JWT (JSON Web Token)
- **Documentation**: Swagger

### API Endpoints

#### 1. User Authentication

- **Endpoint**: `/api/auth/register`

  - Method: POST
  - Description: Register a new user.
  - Request Body: `{ username: string, email: string, password: string }`
  - Response: `{ message: "User registered successfully." }`

- **Endpoint**: `/api/auth/login`
  - Method: POST
  - Description: Log in a user and issue a JWT.
  - Request Body: `{ email: string, password: string }`
  - Response: `{ token: string }`

#### 2. Create Short URL

- **Endpoint**: `/api/shorten`
  - Method: POST
  - Request Body:
    ```json
    {
      "longUrl": "string",
      "customAlias": "string (optional)",
      "topic": "string (optional)"
    }
    ```
  - Response:
    ```json
    {
      "shortUrl": "string",
      "createdAt": "datetime"
    }
    ```

#### 3. Redirect Short URL

- **Endpoint**: `/api/shorten/{alias}`
  - Method: GET
  - Description: Redirect to the original URL.

#### 4. Get URL Analytics

- **Endpoint**: `/api/analytics/{alias}`
  - Method: GET
  - Response:
    ```json
    {
      "totalClicks": "number",
      "uniqueClicks": "number",
      "clicksByDate": [{ "date": "string", "clicks": "number" }],
      "osType": [
        {
          "osName": "string",
          "uniqueClicks": "number",
          "uniqueUsers": "number"
        }
      ],
      "deviceType": [
        {
          "deviceName": "string",
          "uniqueClicks": "number",
          "uniqueUsers": "number"
        }
      ]
    }
    ```

#### 5. Get Topic-Based Analytics

- **Endpoint**: `/api/analytics/topic/{topic}`
  - Method: GET
  - Response:
    ```json
    {
      "totalClicks": "number",
      "uniqueClicks": "number",
      "clicksByDate": [{ "date": "string", "clicks": "number" }],
      "urls": [
        {
          "shortUrl": "string",
          "totalClicks": "number",
          "uniqueClicks": "number"
        }
      ]
    }
    ```

#### 6. Get Overall Analytics

- **Endpoint**: `/api/analytics/overall`
  - Method: GET
  - Response:
    ```json
    {
      "totalUrls": "number",
      "totalClicks": "number",
      "uniqueClicks": "number",
      "clicksByDate": [{ "date": "string", "clicks": "number" }],
      "osType": [
        {
          "osName": "string",
          "uniqueClicks": "number",
          "uniqueUsers": "number"
        }
      ],
      "deviceType": [
        {
          "deviceName": "string",
          "uniqueClicks": "number",
          "uniqueUsers": "number"
        }
      ]
    }
    ```

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file with the following variables:
   ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/url-shortener
    JWT_SECRET=dasduyc8q96248gdb28d7der27tredguadg7e
    BASE_URL=http://localhost:3000
   ```
4. Start the server:
   ```bash
   npm start
   ```

---

## Testing

Run the tests using Jest:

```bash
npm test
```

---

## Documentation

API documentation is available via Swagger:

- Access at: `http://localhost:3000/api-docs`
