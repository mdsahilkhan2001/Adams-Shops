# Adams Auth Server

This directory contains the Node.js / Express / MongoDB authentication server for Adams Islamic Boutique.

## Setup

1. Install dependencies:
   ```bash
   cd backend-node
   npm install
   ```

2. Create an `.env` file from `.env.example` and set the values.

3. Start the server:
   ```bash
   npm run dev
   ```

## Default URLs

- Auth API base: `http://localhost:4000/api`
- Health check: `http://localhost:4000/api/health`

## Features

- JWT access token
- Refresh token cookie
- Email verification
- Password reset
- Account locking after failed attempts
- Admin login and RBAC support
- Secure cookies and CORS
- User profile update

## Notes

- The frontend should use `VITE_AUTH_API_URL=http://localhost:4000/api`
- The refresh token is stored in an HTTP-only cookie
- Access tokens are held in frontend memory and refreshed automatically
