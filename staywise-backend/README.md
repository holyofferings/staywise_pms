# Staywise CRM Backend

Backend server for Staywise Hotel CRM SaaS application. This API provides endpoints for managing hotels, rooms, bookings, orders, QR codes, automation, and AI agents.

## Features

- **Authentication**: JWT-based authentication with roles (admin, staff, superadmin)
- **Hotel Management**: Create and manage hotel properties
- **Room Management**: CRUD operations for hotel rooms with image uploads
- **Booking System**: Comprehensive booking management
- **Order Processing**: Room service, amenities, and other guest orders
- **QR Code Generation**: Dynamic QR codes for various hotel services
- **Automation**: Trigger-action based automation for hotel operations
- **AI Integration**: Configurable AI agents for customer service
- **Marketing Tools**: AI-powered marketing template generation

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication
- **Socket.IO**: Real-time updates
- **Multer**: File uploads
- **Swagger**: API documentation

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/staywise-crm.git
   cd staywise-crm/staywise-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `example.env`:
   ```
   cp example.env .env
   ```

4. Configure your environment variables in the `.env` file

5. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

API documentation is available at `/api-docs` when the server is running.

## Project Structure

```
staywise-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── uploads/             # Uploaded files
├── example.env          # Example environment variables
├── package.json         # Dependencies and scripts
└── README.md            # Project documentation
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reloading
- `npm test`: Run tests

## Socket.IO Events

The server supports real-time updates through Socket.IO:

- Connect to the socket server
- Join a hotel room: `socket.emit('join_hotel', hotelId)`
- Listen for various events:
  - `booking_created`: New booking created
  - `booking_updated`: Booking status changed
  - `order_created`: New order placed
  - `order_status_updated`: Order status updated

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 