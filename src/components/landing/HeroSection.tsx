import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@/hooks/use-theme";

const HeroSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  // Set the background color for images based on theme
  const imageBackgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
  
  // Ensure theme is properly applied when component mounts
  useEffect(() => {
    // Re-apply the current theme class to ensure proper styling after navigation
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleStartForFree = () => {
    navigate('/signup');
  };

  const handleTalkToSales = () => {
    // Navigate to the contact page
    navigate('/contact');
  };

  return (
    <section className="flex items-start mt-0 bg-background">
      <div className="relative flex-1 shrink w-full basis-0 min-w-60 max-md:max-w-full">
        <div className="flex absolute inset-x-0 top-0 z-0 w-full bottom-[255px] min-h-[1020px] max-md:max-w-full" />
        <div className="flex z-0 flex-col items-center px-6 pt-20 w-full max-md:pl-5 max-md:max-w-full">
          <h1 className="mt-1 max-w-full text-8xl font-bold tracking-tighter text-center leading-[88px] text-foreground w-[754px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
            Elevate Your<br />Hotel Operations with AI
          </h1>

          <h2 className="pb-px mt-5 max-w-full text-2xl font-medium tracking-tight leading-8 text-center text-foreground/80 w-[550px] max-md:max-w-full">
            Experience the future of Hotels with intelligent, <br />
            scalable automation and AI solutions tailored to your needs
          </h2>

          <div className="flex gap-3 justify-center items-start mt-8 max-w-full text-base font-medium tracking-normal text-center w-[268px]">
            <button 
              onClick={handleStartForFree}
              className="overflow-hidden self-stretch py-3.5 pr-5 pl-4 text-primary-foreground rounded-xl border border-primary-foreground border-solid bg-primary shadow-[0px_1px_0px_rgba(27,31,35,0.2)] hover:bg-primary/90 transition-colors"
            >
              Start for free
            </button>
            <button 
              onClick={handleTalkToSales}
              className="self-stretch py-3.5 pr-4 pl-4 rounded-xl border border-border border-solid text-foreground hover:bg-muted transition-colors"
            >
              Talk to sales
            </button>
          </div>

          <div className="mt-10 w-full max-w-[1000px] mx-auto rounded-xl overflow-hidden shadow-lg">
            <video 
              className="w-full aspect-video object-cover" 
              autoPlay 
              loop 
              muted 
              playsInline
              controls
            >
              <source src="/demo-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 