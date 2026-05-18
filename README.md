# GigFlow - Sales Operations Tool

GigFlow is a dense, typography-first sales operations dashboard. It features a complete authentication system with Role-Based Access Control (RBAC) and a fully functional Leads management module.

## Architecture
- **Client**: React, TypeScript, Vite, Tailwind CSS v4, React Query, Zustand.
- **Server**: Node.js, Express, TypeScript, Mongoose (MongoDB).
- **Infrastructure**: Native Node.js environment

## Roles
1. **Sales**: Can create leads, and can only view/edit/delete leads that they have created.
2. **Admin**: Has global access to view, edit, and delete any lead created by any user. Admins also see an extra "Created By" column in the dashboard.

## Setup Instructions

### Environment Setup
1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
2. Adjust the `.env` file variables if needed. Note that the `.env` file should contain your MongoDB Atlas URI.

### Running with Docker (Recommended)
For an instant fully containerized setup (Mongo, Express API, Vite Client):
```bash
docker compose up --build
```
- Client Dashboard: `http://localhost:5173`
- Backend API: `http://localhost:5050`

### Running Locally (Natively)

**1. MongoDB**
Ensure your `.env` file contains a valid `MONGO_URI` pointing to your MongoDB Atlas cluster.

**2. Server**
```bash
cd server
npm install
npm run dev
```

**3. Client**
```bash
cd client
npm install
npm run dev
```

## Known Limitations
- The application currently lacks email verification / password reset flows.
- Data export is handled via client-side JSON-to-CSV generation rather than server-side streaming.
- Rate limiting is applied universally to auth routes based on IP, not accounting for distributed setups without proper proxy configuration.
