import { eq, and, gte, lte, desc } from "drizzle-orm";
import { db } from "../db";
import { InsertRoom, SelectRoom, rooms } from "../schema/room-schema";

export const createRoom = async (data: InsertRoom) => {
  try {
    const [newRoom] = await db.insert(rooms).values(data).returning();
    return newRoom;
  } catch (error) {
    console.error("Error creating room:", error);
    throw new Error("Failed to create room");
  }
};

export const getRoomById = async (id: string) => {
  try {
    const room = await db.query.rooms.findFirst({
      where: eq(rooms.id, id)
    });
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    return room;
  } catch (error) {
    console.error("Error getting room by ID:", error);
    throw new Error("Failed to get room");
  }
};

export const getAllRooms = async (): Promise<SelectRoom[]> => {
  try {
    return db.query.rooms.findMany({
      orderBy: (rooms, { desc }) => [desc(rooms.createdAt)]
    });
  } catch (error) {
    console.error("Error getting all rooms:", error);
    throw new Error("Failed to get rooms");
  }
};

export const getAvailableRooms = async (checkIn: Date, checkOut: Date): Promise<SelectRoom[]> => {
  try {
    // Implementation to check availability against bookings
    return db.query.rooms.findMany({
      where: eq(rooms.isAvailable, true)
    });
  } catch (error) {
    console.error("Error getting available rooms:", error);
    throw new Error("Failed to get available rooms");
  }
};

export const updateRoom = async (id: string, data: Partial<InsertRoom>) => {
  try {
    const [updatedRoom] = await db
      .update(rooms)
      .set(data)
      .where(eq(rooms.id, id))
      .returning();
    
    return updatedRoom;
  } catch (error) {
    console.error("Error updating room:", error);
    throw new Error("Failed to update room");
  }
};

export const deleteRoom = async (id: string) => {
  try {
    await db.delete(rooms).where(eq(rooms.id, id));
  } catch (error) {
    console.error("Error deleting room:", error);
    throw new Error("Failed to delete room");
  }
}; 