import React from "react";
import { StaywiseButton } from "@/components/ui/StaywiseButton";

export const Hero: React.FC = () => {
  const arrowIcon = (
    <div
      dangerouslySetInnerHTML={{
        __html:
          '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="button-icon" style="width: 16px; height: 16px"> <path d="M5.06669 11.3334L11.7334 4.66669" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.06669 4.66669H11.7334V11.3334" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
      }}
    />
  );

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      const navbarHeight = 80;
      const offsetPosition = servicesSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handlePlansClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      const navbarHeight = 80;
      const offsetPosition = pricingSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="flex flex-col justify-center items-center w-full min-h-[90vh] pt-16 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="flex flex-col items-center gap-8 sm:gap-10 max-w-[1200px] mx-auto py-16">
        <h1 className="flex flex-col items-center text-foreground text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight sm:leading-[66px] tracking-[-1.2px] text-center">
          <span className="max-w-[900px]">Elevate Your Hotel Operations with</span>
          <span className="max-w-[900px]">AI-Driven Guest Management</span>
        </h1>
        <p className="flex flex-col items-center text-foreground/80 text-base sm:text-lg font-normal leading-[27px] tracking-[-0.36px] text-center max-w-[800px]">
          <span>
            Experience the future of Hotels with intelligent, scalable
          </span>
          <span>automation and AI solutions tailored to your needs</span>
        </p>
        <div className="flex gap-[15px] mt-6">
          <StaywiseButton 
            variant="primary" 
            icon={arrowIcon}
            onClick={handleServicesClick}
          >
            Our Services
          </StaywiseButton>
          <StaywiseButton 
            variant="secondary"
            onClick={handlePlansClick}
          >
            See Plans
          </StaywiseButton>
        </div>
      </div>
    </section>
  );
};
