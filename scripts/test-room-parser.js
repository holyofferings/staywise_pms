// Simple script to test the room parser API
import fetch from 'node-fetch';

async function testRoomParser() {
  const prompt = "add 10 rooms where 5 rooms standard 2 deluxe and 3 suite rooms";
  
  try {
    console.log(`Testing room parser with prompt: "${prompt}"`);
    
    const response = await fetch('http://localhost:3001/api/rooms/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', response.status, response.statusText);
      console.error('Error details:', errorText);
      return;
    }
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('Parsed rooms:', JSON.stringify(data.rooms, null, 2));
      console.log(`Successfully parsed ${data.rooms.length} rooms`);
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
    }
  } catch (error) {
    console.error('Error making request:', error);
  }
}

testRoomParser(); 