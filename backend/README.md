# StayWise PMS Backend

This is the backend server for StayWise PMS, a property management system for hotels.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL with Drizzle ORM

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd staywise_pms/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
5. Update the environment variables in `.env.local` with your database credentials and other configurations.

### Development

To start the development server:

```bash
npm run dev
```

The server will be running at http://localhost:3001.

### API Endpoints

#### Health Check
- `GET /api/health` - Check if the server is running

#### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room by ID
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

#### Bookings
- `GET /api/bookings` - Get all bookings

#### Users
- `GET /api/users` - Get all users

### Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Business logic for routes
│   ├── routes/         # API route definitions
│   ├── db.ts           # Database connection
│   └── server.ts       # Main application entry point
├── package.json
└── tsconfig.json
``` 