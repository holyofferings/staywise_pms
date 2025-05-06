import type { NextApiRequest, NextApiResponse as BaseNextApiResponse } from 'next';

// Define an extended response type that includes setHeader
type NextApiResponse = BaseNextApiResponse & {
  setHeader: (name: string, value: string) => void;
};

// Mock database
let reservations = [
  {
    id: '1',
    guestName: 'John Smith',
    roomNumber: '101',
    checkIn: '2024-03-15',
    checkOut: '2024-03-18',
    status: 'confirmed',
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    roomNumber: '205',
    checkIn: '2024-03-20',
    checkOut: '2024-03-25',
    status: 'pending',
  },
];

// Mock rooms
let rooms = [
  { id: "1", number: "101", type: "single", status: "occupied", price: 2500, capacity: 1, currentGuest: "John Smith" },
  { id: "2", number: "102", type: "single", status: "available", price: 2500, capacity: 1 },
  { id: "3", number: "103", type: "single", status: "maintenance", price: 2500, capacity: 1 },
  { id: "4", number: "104", type: "double", status: "available", price: 3900, capacity: 2 },
  { id: "5", number: "105", type: "double", status: "available", price: 3900, capacity: 2 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers to allow requests from any origin (in a real app, restrict this)
  // Using the headers object directly to avoid TypeScript errors
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/reservations - List all reservations
  if (req.method === 'GET') {
    return res.status(200).json({ reservations, rooms });
  }

  // POST /api/reservations - Create a new reservation
  if (req.method === 'POST') {
    const { guestName, roomNumber, checkIn, checkOut, price, notes } = req.body;

    // Basic validation
    if (!guestName || !roomNumber || !checkIn || !checkOut) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the room exists and is available
    const roomIndex = rooms.findIndex(room => room.number === roomNumber && room.status === 'available');
    if (roomIndex === -1) {
      return res.status(400).json({ error: 'Room not available or does not exist' });
    }

    // Create the reservation
    const newReservation = {
      id: Date.now().toString(),
      guestName,
      roomNumber,
      checkIn,
      checkOut,
      price: price || rooms[roomIndex].price, // Use custom price or default room price
      notes: notes || '',
      status: 'confirmed',
    };

    // Update the reservation list
    reservations = [...reservations, newReservation];

    // Update the room status
    rooms[roomIndex].status = 'reserved';
    rooms[roomIndex].currentGuest = guestName;

    return res.status(201).json({ 
      message: 'Reservation created successfully',
      reservation: newReservation,
      room: rooms[roomIndex]
    });
  }

  // PUT /api/reservations/:id - Update a reservation
  if (req.method === 'PUT') {
    const { id, guestName, roomNumber, checkIn, checkOut, status } = req.body;

    // Find the reservation
    const reservationIndex = reservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update the reservation
    const updatedReservation = {
      ...reservations[reservationIndex],
      guestName: guestName || reservations[reservationIndex].guestName,
      roomNumber: roomNumber || reservations[reservationIndex].roomNumber,
      checkIn: checkIn || reservations[reservationIndex].checkIn,
      checkOut: checkOut || reservations[reservationIndex].checkOut,
      status: status || reservations[reservationIndex].status,
    };

    reservations[reservationIndex] = updatedReservation;

    // If status changed to cancelled, update room status
    if (status === 'cancelled' && reservations[reservationIndex].status !== 'cancelled') {
      const roomIndex = rooms.findIndex(room => room.number === updatedReservation.roomNumber);
      if (roomIndex !== -1) {
        rooms[roomIndex].status = 'available';
        rooms[roomIndex].currentGuest = undefined;
      }
    }

    return res.status(200).json({ 
      message: 'Reservation updated successfully',
      reservation: updatedReservation 
    });
  }

  // DELETE /api/reservations/:id - Cancel a reservation
  if (req.method === 'DELETE') {
    const { id } = req.query;

    // Find the reservation
    const reservationIndex = reservations.findIndex(r => r.id === id);
    if (reservationIndex === -1) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const roomNumber = reservations[reservationIndex].roomNumber;

    // Remove the reservation
    reservations = reservations.filter(r => r.id !== id);

    // Update room status
    const roomIndex = rooms.findIndex(room => room.number === roomNumber);
    if (roomIndex !== -1) {
      rooms[roomIndex].status = 'available';
      rooms[roomIndex].currentGuest = undefined;
    }

    return res.status(200).json({ 
      message: 'Reservation cancelled successfully' 
    });
  }

  // Method not allowed
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
} 