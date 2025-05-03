import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './styles/theme.css'

// Initialize theme from localStorage or default to system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("staywise-theme");
  
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.add("light");
  }
};

// Run theme initialization before rendering
initializeTheme();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
