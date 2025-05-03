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
    // Scroll to contact form or pricing section with a query parameter
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // You could also add a URL parameter if you want to show a contact form
      // navigate('/#pricing?showContactForm=true');
    }
  };

  return (
    <section className="flex items-start mt-0 bg-background">
      <div className="relative flex-1 shrink pt-20 w-full basis-0 min-w-60 max-md:max-w-full">
        <div className="flex absolute inset-x-0 top-0 z-0 w-full bottom-[255px] min-h-[1020px] max-md:max-w-full" />
        <div className="flex z-0 flex-col items-center px-6 pt-20 w-full max-md:pl-5 max-md:max-w-full">
          <a href="#" className="flex items-start p-px max-w-full bg-muted rounded-3xl w-[358px]">
            <div className="flex gap-1.5 py-0.5 pr-2 pl-0.5 min-w-60 w-[355px]">
              <span className="pt-0.5 pr-2.5 pb-1 pl-2.5 text-sm font-medium tracking-normal leading-snug text-primary-foreground rounded-3xl bg-primary">
                Aug 4th
              </span>
              <div className="flex flex-auto gap-0 items-end pb-px my-auto">
                <span className="text-sm font-medium tracking-normal leading-snug text-foreground">
                  In SF? Join our in-person onboardings
                </span>
                <div className="flex overflow-hidden justify-center items-start w-[18px]">
                  <div className="flex items-start px-2 py-1.5 w-[18px]">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/d039845d66ec8d32be86941694aa83e58ca3adfb?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
                      className="object-contain aspect-[0.37] w-[3px]"
                      style={{ backgroundColor: imageBackgroundColor, borderRadius: '2px' }}
                      alt="Arrow icon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </a>

          <h1 className="mt-8 max-w-full text-8xl font-bold tracking-tighter text-center leading-[88px] text-foreground w-[754px] max-md:max-w-full max-md:text-4xl max-md:leading-10">
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

          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f25527dd44f41bf9c8cd1afe0f24f9fa76b6609a?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
            className="object-contain z-10 self-stretch mb-0 w-full aspect-[1.49] max-md:mb-2.5 max-md:max-w-full rounded-lg"
            style={{ backgroundColor: imageBackgroundColor }}
            alt="Hotel operations dashboard"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 