#!/usr/bin/env node

/**
 * Development startup script for StayWise PMS
 * Runs both frontend and backend servers concurrently
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Check if directories exist
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');

if (!fs.existsSync(backendDir)) {
  console.error(`${colors.red}${colors.bright}Backend directory not found!${colors.reset}`);
  console.error(`${colors.yellow}Make sure the directory exists at: ${backendDir}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.bright}${colors.magenta}=== Starting StayWise PMS Development Servers ===${colors.reset}`);

// Start backend server
const backend = spawn('npm', ['run', 'dev'], { cwd: backendDir, shell: true });

backend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    console.log(`${colors.cyan}[Backend]${colors.reset} ${line}`);
  });
});

backend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    console.log(`${colors.red}[Backend ERROR]${colors.reset} ${line}`);
  });
});

// Start frontend server
const frontend = spawn('npm', ['run', 'dev'], { cwd: rootDir, shell: true });

frontend.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    console.log(`${colors.green}[Frontend]${colors.reset} ${line}`);
  });
});

frontend.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    console.log(`${colors.red}[Frontend ERROR]${colors.reset} ${line}`);
  });
});

// Handle process termination
const cleanup = () => {
  console.log(`\n${colors.yellow}Shutting down servers...${colors.reset}`);
  backend.kill();
  frontend.kill();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Handle server exit
backend.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.log(`${colors.red}Backend server exited with code ${code}${colors.reset}`);
  }
});

frontend.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.log(`${colors.red}Frontend server exited with code ${code}${colors.reset}`);
  }
}); 