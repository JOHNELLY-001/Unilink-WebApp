# UniLink

A mentorship platform connecting high-school students with professional mentors — career exploration, mentor connections, scheduled sessions, community forum, learning resources, and opportunity tracking.

## Structure

```
unilink/
├── server/   Express 5 API (Neon Postgres, JWT cookie auth, Cloudinary uploads)
└── webapp/   Vue 3 + Vite SPA (Pinia, Vue Router)
```

## Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- [Cloudinary](https://cloudinary.com) account (file uploads)
- Google OAuth client ID (Google Sign-In)

## Setup

### 1. Database

```bash
cd server
npm install
cp .env.example .env        # fill in your values
npm run migrate             # runs SQL migrations in src/db/migrations
```

### 2. API server

```bash
cd server
npm run dev                 # nodemon on http://localhost:5000
```

### 3. Web app

```bash
cd webapp
npm install
cp .env.example .env        # set VITE_API_BASE_URL
npm run dev                 # Vite on http://localhost:5173
```

## Environment variables

### server/.env

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port (default 5000) |
| `DATABASE_URL` | Neon Postgres connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Random secrets for token signing |
| `JWT_ACCESS_EXPIRES` / `JWT_REFRESH_EXPIRES` | Token lifetimes (15m / 7d) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Upload credentials |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `CLIENT_URL` | Frontend origin for CORS (no trailing slash) |

### webapp/.env

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | API base URL, e.g. `http://localhost:5000/api/v1` |

## Auth model

- JWT access (15 min) + refresh (7d) tokens in httpOnly cookies
- The webapp silently refreshes on any 401 and retries the original request
- Refresh tokens are SHA-256 hashed in the `refresh_tokens` table and rotated on use
- Google Sign-In issues the same cookie pair

### Google Sign-In setup (keys required)

1. In [Google Cloud Console](https://console.cloud.google.com):
   - Configure the **OAuth consent screen** (External, app name, support email)
   - Create **Credentials → OAuth 2.0 Client ID → Web application**
   - Under **Authorized JavaScript origins** add:
     - `http://localhost:5173` (dev)
     - Your deployed frontend URL, e.g. `https://unilink.vercel.app` (prod)
   - No redirect URI is needed — the app uses Google Identity Services (ID token flow)
2. Copy the same **Client ID** to both:
   - `server/.env` → `GOOGLE_CLIENT_ID` (backend verifies the token's audience against it)
   - `webapp/.env` → `VITE_GOOGLE_CLIENT_ID` (frontend renders the Google button)
3. No client secret is required — the flow sends only the verified ID token.
4. Restart both dev servers after editing `.env` files.


## Roles

- **student** — careers, mentors, opportunities, progress, community
- **mentor** — pending requests, my students, sessions (admin approval required after onboarding)
- **admin** — approvals, user management, careers/opportunities/resources CRUD, community moderation
