import { ActionResponse } from "../types/api-types";
import { InsertRoom, SelectRoom } from "../../db/schema/room-schema";

const API_URL = import.meta.env.VITE_API_URL || "";

export const createRoom = async (data: InsertRoom): Promise<ActionResponse<SelectRoom>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error creating room:", error);
    return {
      status: "error",
      message: "Failed to create room"
    };
  }
};

export const getRoomById = async (id: string): Promise<ActionResponse<SelectRoom>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${id}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting room:", error);
    return {
      status: "error",
      message: "Failed to get room"
    };
  }
};

export const getAllRooms = async (): Promise<ActionResponse<SelectRoom[]>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms`);
    return await response.json();
  } catch (error) {
    console.error("Error getting rooms:", error);
    return {
      status: "error",
      message: "Failed to get rooms"
    };
  }
};

export const getAvailableRooms = async (checkIn: Date, checkOut: Date): Promise<ActionResponse<SelectRoom[]>> => {
  try {
    const response = await fetch(
      `${API_URL}/api/rooms/available?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error getting available rooms:", error);
    return {
      status: "error",
      message: "Failed to get available rooms"
    };
  }
};

export const updateRoom = async (id: string, data: Partial<InsertRoom>): Promise<ActionResponse<SelectRoom>> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error updating room:", error);
    return {
      status: "error",
      message: "Failed to update room"
    };
  }
};

export const deleteRoom = async (id: string): Promise<ActionResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/rooms/${id}`, {
      method: "DELETE",
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting room:", error);
    return {
      status: "error",
      message: "Failed to delete room"
    };
  }
}; 