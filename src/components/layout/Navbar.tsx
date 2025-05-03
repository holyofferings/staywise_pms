import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { StaywiseButton } from "@/components/ui/StaywiseButton";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  hideAuthButtons?: boolean;
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  hideAuthButtons = false,
  onLogoClick 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Set the background color to light theme
  const logoBackgroundColor = '#ffffff';

  // Track scroll position to add blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Ensure light theme is applied
  useEffect(() => {
    // Force light theme application
    const root = document.documentElement;
    
    // Clear classes first
    root.classList.remove('dark', 'light');
    
    // Apply light theme
    root.classList.add('light');
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#security" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    
    // Handle special case for "Home" - scroll to top
    if (href === "#hero") {
      // Dispatch custom event for scrolling to top
      window.dispatchEvent(new Event('scrollToTop'));
      
      // Update URL without refreshing the page
      window.history.pushState(null, '', href);
      return;
    }
    
    // For other navigation items
    const targetId = href.replace('#', '');
    
    // Dispatch custom event for scrolling to section
    window.dispatchEvent(new CustomEvent('scrollToSection', {
      detail: { sectionId: targetId }
    }));
    
    // Update URL without refreshing the page
    window.history.pushState(null, '', href);
  };

  const handleLogo = (e: React.MouseEvent) => {
    if (onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  return (
    <nav className={`w-full fixed top-0 z-50 transition-all duration-300 text-foreground ${
      isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-background'
    } border-b border-border`}>
      <div className="mx-auto max-w-[1440px]">
        <div className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onClick={handleLogo}
            >
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                    `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 32px; height: 32px; opacity: 0.9; background-color: ${logoBackgroundColor}; border-radius: 4px;"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="white"></rect> </clipPath> </defs> </svg>`,
                  }}
                />
              </div>
            <span className="text-foreground text-xl font-medium leading-[16.8px]">
                Staywise
              </span>
            </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="text-foreground/80 hover:text-foreground transition-colors"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            
            {!hideAuthButtons && (
              <>
                <Link to="/login">
                  <StaywiseButton variant="secondary">Login</StaywiseButton>
                </Link>
                
                <a 
                  href="#contact" 
                  onClick={(e) => handleNavClick(e, "#contact")}
                >
                  <StaywiseButton variant="primary">
                    Get Demo
                  </StaywiseButton>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="text-foreground p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md py-4 px-4 border-t border-foreground/10">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="text-foreground/80 hover:text-foreground py-2"
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
            
            {!hideAuthButtons && (
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/login" className="w-full">
                  <StaywiseButton variant="secondary" className="w-full">Login</StaywiseButton>
                </Link>
                
                <a 
                  href="#contact" 
                  onClick={(e) => handleNavClick(e, "#contact")} 
                  className="w-full"
                >
                  <StaywiseButton variant="primary" className="w-full">
                    Get Demo
                  </StaywiseButton>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
