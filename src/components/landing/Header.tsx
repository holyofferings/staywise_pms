import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@/hooks/use-theme";

const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleStartForFree = () => {
    navigate('/signup');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // Set the background color based on theme
  const logoBackgroundColor = theme === 'dark' ? '#000000' : '#ffffff';

  return (
    <header className="flex z-10 justify-center items-start bg-background">
      <div className="flex-1 shrink px-6 w-full basis-0 max-w-[1440px] min-w-60 max-md:px-5 max-md:max-w-full">
        <nav className="flex gap-5 justify-between items-start py-4 w-full max-md:max-w-full">
          <button 
            onClick={handleLogoClick}
            className="flex items-start bg-transparent border-0 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 48px; height: 48px; opacity: 0.9; background-color: ${logoBackgroundColor}; border-radius: 4px;"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="white"></rect> </clipPath> </defs> </svg>`,
                  }}
                />
              </div>
              <span className="text-foreground text-5xl text-bold font-large leading-[20.8px]">
                Staywise
              </span>
            </div>
          </button>

          <div className="flex flex-wrap gap-7 max-md:max-w-full">
            <div className="flex gap-2.5 items-center">
              <a 
                href="#security" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('HeroSection');
                }}
                className="self-stretch my-auto text-base font-medium tracking-normal text-center text-foreground hover:text-foreground/80 transition-colors"
              >
                About
              </a>
              <a 
                href="#features" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
                className="flex gap-1 justify-center items-start self-stretch py-2 pr-4 pl-4 rounded-xl"
              >
                <span className="text-base font-medium tracking-normal text-center text-foreground">
                  Features
                </span>
                
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('pricing');
                }}
                className="self-stretch my-auto text-base font-medium tracking-normal text-center text-foreground"
              >
                Pricing
              </a>
            </div>
            
          </div>

          <div className="flex gap-3 items-start text-base font-medium tracking-normal">
            <button 
              onClick={handleSignIn}
              className="self-stretch py-2 pr-4 pl-4 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
            >
              Sign in
            </button>
            <button 
              onClick={handleStartForFree}
              className="overflow-hidden self-stretch px-4 py-2 text-primary-foreground rounded-xl border border-primary-foreground border-solid bg-primary shadow-[0px_1px_0px_rgba(27,31,35,0.2)] hover:bg-primary/90 transition-colors"
            >
              Start for free
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 