import { NextApiRequest, NextApiResponse } from 'next';

// Interface for parsed room data
interface ParsedRoom {
  room_no: number;
  type: string;
  price: number;
  availability: string;
  floor?: number;
  features?: string[];
}

/**
 * Parse room numbers from ranges like "101-110" or individual numbers like "101, 102, 103"
 */
function parseRoomNumbers(input: string): number[] {
  const roomNumbers: number[] = [];
  
  // Check for ranges like "101-110"
  const rangeMatches = input.match(/(\d+)\s*-\s*(\d+)/g);
  if (rangeMatches) {
    for (const rangeMatch of rangeMatches) {
      const [start, end] = rangeMatch.split('-').map(num => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          roomNumbers.push(i);
        }
      }
    }
    // Remove the processed ranges from input
    input = input.replace(/(\d+)\s*-\s*(\d+)/g, '');
  }
  
  // Check for individual room numbers
  const numberMatches = input.match(/\b\d+\b/g);
  if (numberMatches) {
    for (const numStr of numberMatches) {
      const num = parseInt(numStr);
      if (!isNaN(num) && !roomNumbers.includes(num)) {
        roomNumbers.push(num);
      }
    }
  }
  
  return roomNumbers;
}

/**
 * Extract room type from the prompt (Standard, Deluxe, Suite, Penthouse)
 */
function extractRoomType(prompt: string): string {
  // Standard match patterns for room types
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Penthouse'];
  const typeRegex = new RegExp(`\\b(${roomTypes.join('|')})\\b`, 'i');
  
  const match = prompt.match(typeRegex);
  if (match) {
    // Return the matched type with proper capitalization
    const type = match[0].toLowerCase();
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  
  // Default to Standard if no specific type is found
  return 'Standard';
}

/**
 * Extract price from prompt (patterns like "$99", "99 dollars", "99 per night", etc.)
 */
function extractPrice(prompt: string): number {
  // Look for price patterns like $99, 99 dollars, 99 per night, etc.
  const priceRegex = /\$?(\d+(?:\.\d+)?)\s*(?:dollars?|per\s*night)?/i;
  const match = prompt.match(priceRegex);
  
  if (match) {
    return parseFloat(match[1]);
  }
  
  // Default price if not found
  return 99.99;
}

/**
 * Extract room availability status from prompt
 */
function extractAvailability(prompt: string): string {
  const statuses = ['available', 'occupied', 'maintenance', 'cleaning'];
  const statusRegex = new RegExp(`\\b(${statuses.join('|')})\\b`, 'i');
  
  const match = prompt.match(statusRegex);
  if (match) {
    const status = match[0].toLowerCase();
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  // Default to Available if no status is specified
  return 'Available';
}

/**
 * Extract floor number from prompt
 */
function extractFloor(prompt: string): number | undefined {
  // Look for floor patterns like "on floor 1", "floor 2", etc.
  const floorRegex = /(?:on)?\s*floor\s*(\d+)/i;
  const match = prompt.match(floorRegex);
  
  if (match) {
    return parseInt(match[1]);
  }
  
  // Try to infer floor from room numbers (e.g., room 101 is on floor 1)
  const roomMatch = prompt.match(/room\s*(\d+)/i);
  if (roomMatch) {
    const roomNum = roomMatch[1];
    if (roomNum.length >= 3) {
      return parseInt(roomNum[0]);
    }
  }
  
  return undefined;
}

/**
 * Extract features from prompt
 */
function extractFeatures(prompt: string): string[] {
  const knownFeatures = [
    'wifi', 'tv', 'minibar', 'jacuzzi', 'balcony', 'kitchen',
    'ocean view', 'city view', 'king bed', 'queen bed', 'twin beds'
  ];
  
  const features: string[] = [];
  
  // Check for "with features" pattern
  const featuresSection = prompt.match(/with\s+features?\s+([^.]+)/i);
  if (featuresSection) {
    const featureText = featuresSection[1].toLowerCase();
    
    // Check for each known feature
    for (const feature of knownFeatures) {
      if (featureText.includes(feature)) {
        features.push(feature);
      }
    }
  } else {
    // Check for individual features mentioned throughout the prompt
    for (const feature of knownFeatures) {
      const featureRegex = new RegExp(`\\b${feature}\\b`, 'i');
      if (featureRegex.test(prompt.toLowerCase())) {
        features.push(feature);
      }
    }
  }
  
  return features;
}

/**
 * Count the number of rooms mentioned in the prompt
 */
function countRequestedRooms(prompt: string): number | null {
  // Look for patterns like "add 5 rooms", "create 10 standard rooms", etc.
  const countMatch = prompt.match(/(?:add|create)\s+(\d+)\s+(?:rooms?|standard|deluxe|suite|penthouse)/i);
  
  if (countMatch) {
    return parseInt(countMatch[1]);
  }
  
  return null;
}

/**
 * Main function to parse the room information from a prompt
 */
function parseRoomPrompt(prompt: string): ParsedRoom[] {
  const parsedRooms: ParsedRoom[] = [];
  
  // Extract common properties that will apply to all rooms
  const roomType = extractRoomType(prompt);
  const price = extractPrice(prompt);
  const availability = extractAvailability(prompt);
  const floor = extractFloor(prompt);
  const features = extractFeatures(prompt);
  
  // Parse room numbers
  const roomNumbers = parseRoomNumbers(prompt);
  
  // If specific room numbers are found, create a room for each number
  if (roomNumbers.length > 0) {
    for (const roomNo of roomNumbers) {
      parsedRooms.push({
        room_no: roomNo,
        type: roomType,
        price: price,
        availability: availability,
        floor: floor || Math.floor(roomNo / 100), // Infer floor from room number if not specified
        features: features
      });
    }
  } else {
    // If no specific room numbers found, check if a count is specified
    const count = countRequestedRooms(prompt);
    
    if (count) {
      // Create requested number of rooms with sequential numbers
      const startNum = floor ? floor * 100 + 1 : 101;
      
      for (let i = 0; i < count; i++) {
        parsedRooms.push({
          room_no: startNum + i,
          type: roomType,
          price: price,
          availability: availability,
          floor: floor || Math.floor((startNum + i) / 100),
          features: features
        });
      }
    } else {
      // If neither specific rooms nor a count is specified, create a default room
      parsedRooms.push({
        room_no: floor ? floor * 100 + 1 : 101,
        type: roomType,
        price: price,
        availability: availability,
        floor: floor || 1,
        features: features
      });
    }
  }
  
  return parsedRooms;
}

/**
 * API handler for parsing room information
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Invalid prompt provided' });
    }
    
    // Parse the prompt to extract room information
    const parsedRooms = parseRoomPrompt(prompt);
    
    // Validate the results (e.g., check for duplicate room numbers)
    const roomNumbers = new Set<number>();
    const validatedRooms = parsedRooms.filter(room => {
      if (roomNumbers.has(room.room_no)) {
        return false; // Filter out duplicates
      }
      roomNumbers.add(room.room_no);
      return true;
    });
    
    // Return the parsed room information
    return res.status(200).json(validatedRooms);
  } catch (error) {
    console.error('Error parsing room prompt:', error);
    return res.status(500).json({ message: 'Error parsing room information' });
  }
} 