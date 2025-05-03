import React, { useEffect } from "react";
import InputDesign from "@/components/landing/InputDesign";

const LandingPage: React.FC = () => {
  // Ensure light theme is properly applied when component mounts
  useEffect(() => {
    // Force light theme application
    const root = document.documentElement;
    
    // Clear classes first
    root.classList.remove('dark', 'light');
    
    // Apply light theme
    root.classList.add('light');
    
    console.log("LandingPage mounting with light theme");
    console.log("InputDesign component:", InputDesign ? "loaded" : "not loaded");
  }, []);

  return (
    <div className="w-full bg-background min-h-screen">
      <InputDesign />
    </div>
  );
};

export default LandingPage;
