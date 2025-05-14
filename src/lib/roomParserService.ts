// Interface for parsed room data
export interface ParsedRoom {
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
  }
  
  // Check for individual room numbers
  const numberMatches = input.match(/\b\d+\b/g);
  if (numberMatches) {
    for (const numStr of numberMatches) {
      const num = parseInt(numStr);
      if (!isNaN(num) && !roomNumbers.includes(num)) {
        // Only include it if it looks like a room number (typically 3 digits)
        if (numStr.length >= 3) {
          roomNumbers.push(num);
        }
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
 * Validate parsed rooms (e.g., check for duplicate room numbers)
 */
function validateRooms(rooms: ParsedRoom[]): ParsedRoom[] {
  const roomNumbers = new Set<number>();
  return rooms.filter(room => {
    if (roomNumbers.has(room.room_no)) {
      return false; // Filter out duplicates
    }
    roomNumbers.add(room.room_no);
    return true;
  });
}

/**
 * Mock API function to parse room information from a prompt
 */
export async function parseRooms(prompt: string): Promise<ParsedRoom[]> {
  // Normalize the prompt text
  const normalizedPrompt = prompt.toLowerCase().trim();
  
  // Extract total room count
  let totalRooms = extractTotalRoomCount(normalizedPrompt);
  
  // Extract room types and their counts
  const roomTypeCounts = extractRoomTypeCounts(normalizedPrompt, totalRooms);
  
  // Extract floor information
  const floorInfo = extractFloorInfo(normalizedPrompt);
  
  // Extract price information for each room type
  const priceInfo = extractPriceInfo(normalizedPrompt);
  
  // Extract features
  const featuresInfo = extractFeaturesInfo(normalizedPrompt);
  
  // Generate rooms based on extracted information
  return generateRooms(roomTypeCounts, floorInfo, priceInfo, featuresInfo);
}

/**
 * Extract the total room count from the prompt
 */
function extractTotalRoomCount(prompt: string): number {
  // Look for patterns like "add 10 rooms", "create 5 rooms"
  const countMatches = prompt.match(/add\s+(\d+)\s+rooms|create\s+(\d+)\s+rooms|(\d+)\s+rooms/i);
  
  if (countMatches) {
    // Find the first non-undefined group that matched a number
    const count = countMatches.slice(1).find(match => match !== undefined);
    if (count) {
      return parseInt(count);
    }
  }
  
  // If no explicit count found, default to 1
  return 1;
}

/**
 * Extract room types and their counts
 */
function extractRoomTypeCounts(prompt: string, totalRooms: number): Record<string, number> {
  const roomTypes: Record<string, number> = {
    "standard": 0,
    "deluxe": 0,
    "suite": 0
  };
  
  // Look for patterns like "5 standard rooms", "2 deluxe rooms", "3 suite"
  const standardMatches = prompt.match(/(\d+)\s+(standard|economy|basic)/i);
  const deluxeMatches = prompt.match(/(\d+)\s+(deluxe|premium)/i);
  const suiteMatches = prompt.match(/(\d+)\s+(suite|luxury)/i);
  
  if (standardMatches) roomTypes.standard = parseInt(standardMatches[1]);
  if (deluxeMatches) roomTypes.deluxe = parseInt(deluxeMatches[1]);
  if (suiteMatches) roomTypes.suite = parseInt(suiteMatches[1]);
  
  // Calculate sum of specified room types
  const specifiedRooms = Object.values(roomTypes).reduce((sum, count) => sum + count, 0);
  
  // If specific room counts don't match total, adjust the standard room count
  if (specifiedRooms < totalRooms) {
    roomTypes.standard += (totalRooms - specifiedRooms);
  } else if (specifiedRooms > totalRooms) {
    // If user specified more rooms than the total, adjust total to match
    // This handles cases where user didn't provide a total but specified individual counts
    totalRooms = specifiedRooms;
  }
  
  // If no room types were specified, default all to standard
  if (specifiedRooms === 0) {
    roomTypes.standard = totalRooms;
  }
  
  return roomTypes;
}

/**
 * Extract floor information from the prompt
 */
function extractFloorInfo(prompt: string): Record<string, number> {
  const floorInfo: Record<string, number> = {
    "standard": 1,
    "deluxe": 2,
    "suite": 3
  };
  
  // Look for patterns like "on floor 3", "standard rooms on floor 1"
  const standardFloorMatch = prompt.match(/standard.*?floor\s+(\d+)|floor\s+(\d+).*?standard/i);
  const deluxeFloorMatch = prompt.match(/deluxe.*?floor\s+(\d+)|floor\s+(\d+).*?deluxe/i);
  const suiteFloorMatch = prompt.match(/suite.*?floor\s+(\d+)|floor\s+(\d+).*?suite/i);
  
  // General floor match (applies to all types if specific ones not found)
  const generalFloorMatch = prompt.match(/floor\s+(\d+)/i);
  
  if (standardFloorMatch) {
    const floor = standardFloorMatch[1] || standardFloorMatch[2];
    floorInfo.standard = parseInt(floor);
  } else if (generalFloorMatch) {
    floorInfo.standard = parseInt(generalFloorMatch[1]);
  }
  
  if (deluxeFloorMatch) {
    const floor = deluxeFloorMatch[1] || deluxeFloorMatch[2];
    floorInfo.deluxe = parseInt(floor);
  } else if (generalFloorMatch) {
    floorInfo.deluxe = parseInt(generalFloorMatch[1]);
  }
  
  if (suiteFloorMatch) {
    const floor = suiteFloorMatch[1] || suiteFloorMatch[2];
    floorInfo.suite = parseInt(floor);
  } else if (generalFloorMatch) {
    floorInfo.suite = parseInt(generalFloorMatch[1]);
  }
  
  return floorInfo;
}

/**
 * Extract price information from the prompt
 */
function extractPriceInfo(prompt: string): Record<string, number> {
  const priceInfo: Record<string, number> = {
    "standard": 99,
    "deluxe": 149,
    "suite": 299
  };
  
  // Look for patterns like "standard rooms at $99", "$149 for deluxe"
  const standardPriceMatch = prompt.match(/standard.*?\$(\d+)|(\d+)\$.*?standard/i);
  const deluxePriceMatch = prompt.match(/deluxe.*?\$(\d+)|(\d+)\$.*?deluxe/i);
  const suitePriceMatch = prompt.match(/suite.*?\$(\d+)|(\d+)\$.*?suite/i);
  
  // General price match
  const generalPriceMatch = prompt.match(/\$(\d+)/i);
  
  if (standardPriceMatch) {
    const price = standardPriceMatch[1] || standardPriceMatch[2];
    priceInfo.standard = parseInt(price);
  } else if (generalPriceMatch) {
    priceInfo.standard = parseInt(generalPriceMatch[1]);
  }
  
  if (deluxePriceMatch) {
    const price = deluxePriceMatch[1] || deluxePriceMatch[2];
    priceInfo.deluxe = parseInt(price);
  } else if (generalPriceMatch && !standardPriceMatch) {
    // Apply general price to deluxe only if it hasn't been applied to standard
    priceInfo.deluxe = parseInt(generalPriceMatch[1]) + 50; // Make deluxe more expensive
  }
  
  if (suitePriceMatch) {
    const price = suitePriceMatch[1] || suitePriceMatch[2];
    priceInfo.suite = parseInt(price);
  } else if (generalPriceMatch && !standardPriceMatch && !deluxePriceMatch) {
    // Apply general price to suite only if it hasn't been applied to others
    priceInfo.suite = parseInt(generalPriceMatch[1]) + 100; // Make suite even more expensive
  }
  
  return priceInfo;
}

/**
 * Extract features information from the prompt
 */
function extractFeaturesInfo(prompt: string): Record<string, string[]> {
  const featuresInfo: Record<string, string[]> = {
    "standard": ["wifi", "tv"],
    "deluxe": ["wifi", "tv", "minibar"],
    "suite": ["wifi", "tv", "minibar", "jacuzzi"]
  };
  
  // Define possible features to look for
  const possibleFeatures = [
    { id: "wifi", keywords: ["wifi", "internet", "wi-fi"] },
    { id: "tv", keywords: ["tv", "television", "smart tv"] },
    { id: "minibar", keywords: ["minibar", "mini bar", "fridge"] },
    { id: "jacuzzi", keywords: ["jacuzzi", "hot tub", "spa"] },
    { id: "balcony", keywords: ["balcony", "terrace", "patio"] },
    { id: "kitchen", keywords: ["kitchen", "kitchenette"] }
  ];
  
  // Look for features in the prompt
  possibleFeatures.forEach(feature => {
    const hasFeature = feature.keywords.some(keyword => prompt.includes(keyword));
    
    if (hasFeature) {
      // Check if the feature is specifically associated with a room type
      const standardMatch = feature.keywords.some(keyword => 
        new RegExp(`standard.*?${keyword}|${keyword}.*?standard`, 'i').test(prompt)
      );
      
      const deluxeMatch = feature.keywords.some(keyword => 
        new RegExp(`deluxe.*?${keyword}|${keyword}.*?deluxe`, 'i').test(prompt)
      );
      
      const suiteMatch = feature.keywords.some(keyword => 
        new RegExp(`suite.*?${keyword}|${keyword}.*?suite`, 'i').test(prompt)
      );
      
      // If no specific association, add to all types
      if (!standardMatch && !deluxeMatch && !suiteMatch) {
        if (!featuresInfo.standard.includes(feature.id)) featuresInfo.standard.push(feature.id);
        if (!featuresInfo.deluxe.includes(feature.id)) featuresInfo.deluxe.push(feature.id);
        if (!featuresInfo.suite.includes(feature.id)) featuresInfo.suite.push(feature.id);
      } else {
        // Add to specific types
        if (standardMatch && !featuresInfo.standard.includes(feature.id)) 
          featuresInfo.standard.push(feature.id);
        if (deluxeMatch && !featuresInfo.deluxe.includes(feature.id)) 
          featuresInfo.deluxe.push(feature.id);
        if (suiteMatch && !featuresInfo.suite.includes(feature.id)) 
          featuresInfo.suite.push(feature.id);
      }
    }
  });
  
  return featuresInfo;
}

/**
 * Generate rooms based on extracted information
 */
function generateRooms(
  roomTypeCounts: Record<string, number>,
  floorInfo: Record<string, number>,
  priceInfo: Record<string, number>,
  featuresInfo: Record<string, string[]>
): ParsedRoom[] {
  const rooms: ParsedRoom[] = [];
  let roomCounter = 0;
  
  // Process each room type
  Object.entries(roomTypeCounts).forEach(([type, count]) => {
    if (count <= 0) return;
    
    // Get the floor for this room type
    const floor = floorInfo[type];
    
    // Get the price for this room type
    const price = priceInfo[type];
    
    // Get the features for this room type
    const features = featuresInfo[type];
    
    // Generate rooms of this type
    for (let i = 0; i < count; i++) {
      roomCounter++;
      
      // Create room number based on floor and sequence
      // For example: floor 1, room 1 = 101; floor 2, room 3 = 203
      const roomNumber = (floor * 100) + (i + 1);
      
      rooms.push({
        room_no: roomNumber,
        type: type,
        price: price,
        availability: "available",
        floor: floor,
        features: features
      });
    }
  });
  
  return rooms;
} 