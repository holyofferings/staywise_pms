// A simple Express server for the room parser API
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Room parsing endpoint
app.post('/api/rooms/parse', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Prompt is required' 
      });
    }
    
    console.log('Parsing prompt:', prompt);
    
    // Generate mock room data based on the prompt
    const mockRooms = generateMockRooms(prompt);
    
    console.log('Generated rooms:', mockRooms);
    
    return res.status(200).json({ 
      success: true, 
      rooms: mockRooms,
      message: `Successfully parsed ${mockRooms.length} room(s) from prompt`
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process room data' 
    });
  }
});

// Room creation endpoint
app.post('/api/rooms/create', async (req, res) => {
  try {
    const { rooms } = req.body;
    
    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid rooms data is required' 
      });
    }
    
    console.log(`Received request to create ${rooms.length} rooms`);
    
    // In a real app, you would save these to a database
    // For now, we'll just echo them back
    
    return res.status(201).json({ 
      success: true, 
      rooms: rooms,
      message: `Successfully created ${rooms.length} room(s)`
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create rooms' 
    });
  }
});

// Mock function to generate rooms based on prompt
function generateMockRooms(prompt) {
  const rooms = [];
  let totalRooms = 0;
  let standard = 0;
  let deluxe = 0;
  let suite = 0;
  
  // Extract counts using regex
  const totalMatch = prompt.match(/add\s+(\d+)\s+rooms/i);
  if (totalMatch) {
    totalRooms = parseInt(totalMatch[1]);
  }
  
  const standardMatch = prompt.match(/(\d+)\s+(?:rooms?\s+)?standard/i);
  if (standardMatch) {
    standard = parseInt(standardMatch[1]);
  }
  
  const deluxeMatch = prompt.match(/(\d+)\s+(?:rooms?\s+)?deluxe/i);
  if (deluxeMatch) {
    deluxe = parseInt(deluxeMatch[1]);
  }
  
  const suiteMatch = prompt.match(/(\d+)\s+(?:rooms?\s+)?suite/i);
  if (suiteMatch) {
    suite = parseInt(suiteMatch[1]);
  }
  
  // Adjust counts if needed
  const specifiedTotal = standard + deluxe + suite;
  if (totalRooms > 0 && specifiedTotal === 0) {
    // If only total was specified, default to all standard
    standard = totalRooms;
  } else if (totalRooms === 0 && specifiedTotal > 0) {
    // If no total but types specified, use the sum
    totalRooms = specifiedTotal;
  } else if (totalRooms === 0 && specifiedTotal === 0) {
    // If nothing specified, default to 1 standard room
    totalRooms = 1;
    standard = 1;
  }
  
  // Generate room data
  let roomNo = 101;
  
  // Add standard rooms
  for (let i = 0; i < standard; i++) {
    rooms.push({
      room_no: roomNo++,
      type: 'standard',
      price: 99,
      availability: 'available',
      floor: 1,
      features: ['wifi', 'tv']
    });
  }
  
  // Add deluxe rooms
  for (let i = 0; i < deluxe; i++) {
    rooms.push({
      room_no: roomNo++,
      type: 'deluxe',
      price: 149,
      availability: 'available',
      floor: 1,
      features: ['wifi', 'tv', 'minibar']
    });
  }
  
  // Add suite rooms
  for (let i = 0; i < suite; i++) {
    rooms.push({
      room_no: roomNo++,
      type: 'suite',
      price: 249,
      availability: 'available',
      floor: 1,
      features: ['wifi', 'tv', 'minibar', 'jacuzzi']
    });
  }
  
  return rooms;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
}); 