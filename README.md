# Skill vs Skill

## Run locally

Install dependencies and start the frontend:

```sh
npm install
npm run dev
```

Vite listens on all network interfaces, so the app is available at `http://192.168.1.127:5173/` from this computer and other devices on the same LAN. If it does not open from another device, allow Node.js/Vite through Windows Firewall for private networks.

In development, Vite proxies `/api` requests to `http://192.168.1.127:56495` by default and sends `Host: localhost:56495` for the IIS Express binding. Start the API on that address before signing in. To use an API running on another host or port, copy `.env.example` to `.env.local`, set `VITE_API_PROXY_TARGET` to the API origin and `VITE_API_PROXY_HOST` to the hostname and port accepted by that API, then restart Vite.

For a deployed frontend, set `VITE_API_BASE_URL` to the API origin and enable REST CORS on the API for the frontend's origin. The API's current startup configuration does not enable REST CORS.

## API-connected frontend flows

- Sign in, register, and load/update the signed-in user through `/api/auth`.
- Load marketplace categories, skills, skill members, and the user's listings through `/api/marketplace`.
- Load and save the user's availability through `/api/availability`.
- Load matches and sessions, create session requests, accept/reject requests, complete sessions, and submit reviews through `/api/sessions`.
- Load conversations and messages through `/api/chat`.
- Load and manage admin requests, categories, skills, users, and dashboard counts through `/api/admin`.

The frontend uses API data for changing lists and profiles; demo user, skill, session, and schedule data has been removed. The API does not provide a public endpoint for requesting a new catalog skill, so users can create listings only for skills already in the marketplace. It also has no learning-roadmap or current-user review-list endpoint, so those demo sections are not shown. Signup accepts a city as text because the API does not provide a city lookup list.
