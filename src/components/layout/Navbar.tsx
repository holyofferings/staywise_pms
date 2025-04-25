
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StaywiseButton } from "@/components/ui/StaywiseButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 24px; height: 24px; opacity: 0.9"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="white"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="white"></rect> </clipPath> </defs> </svg>',
                  }}
                />
              </div>
              <span className="text-white text-md font-medium leading-[16.8px]">
                Staywise
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <StaywiseButton 
              variant="secondary" 
              className="border border-white/10"
              onClick={handleOpenAuthModal}
            >
              Login
            </StaywiseButton>
            <StaywiseButton variant="primary" onClick={handleOpenAuthModal}>
              Get Started
            </StaywiseButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 py-4 px-4 border-t border-white/10">
          <div className="flex flex-col gap-4">
            <a 
              href="#features" 
              className="text-white/80 hover:text-white py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-white/80 hover:text-white py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#about" 
              className="text-white/80 hover:text-white py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-white/80 hover:text-white py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
            <div className="flex flex-col gap-2 mt-4">
              <StaywiseButton 
                variant="secondary" 
                className="border border-white/10 w-full justify-center"
                onClick={() => {
                  handleOpenAuthModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </StaywiseButton>
              <StaywiseButton 
                variant="primary" 
                className="w-full justify-center"
                onClick={() => {
                  handleOpenAuthModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                Get Started
              </StaywiseButton>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </nav>
  );
};
