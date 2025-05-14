// Script to start the server and verify it's running
import { spawn } from 'child_process';
import fetch from 'node-fetch';

console.log('Starting the server...');

// Start the server using ts-node-dev
const server = spawn('npx', ['ts-node-dev', 'server.ts'], {
  stdio: 'inherit',
  shell: true
});

// Function to check if the server is running
async function checkServerStatus() {
  try {
    console.log('Checking if server is running...');
    const response = await fetch('http://localhost:3001/api/health');
    
    if (response.ok) {
      const data = await response.json();
      console.log('Server status:', data);
      console.log('Server is running at http://localhost:3001');
      return true;
    } else {
      console.log('Server returned non-OK status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('Server not yet responding, retrying in 2 seconds...');
    return false;
  }
}

// Wait for server to start and check status
let attempts = 0;
const maxAttempts = 10;

const checkInterval = setInterval(async () => {
  attempts++;
  
  const isRunning = await checkServerStatus();
  
  if (isRunning) {
    clearInterval(checkInterval);
    console.log('Server is ready to accept requests');
  } else if (attempts >= maxAttempts) {
    clearInterval(checkInterval);
    console.error('Server failed to start after multiple attempts');
    process.exit(1);
  }
}, 2000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill('SIGINT');
  process.exit();
});

console.log('Waiting for server to start...'); 