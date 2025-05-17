"use client";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../../styles/animations.css';

const CtaSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            setShowTypewriter(true);
          }, 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleStartFreeTrial = () => {
    navigate('/signup');
  };

  const handleScheduleDemo = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="flex items-start px-16 pt-32 pb-32 w-full bg-background max-md:px-5 max-md:pt-24 max-md:pb-24 max-md:max-w-full"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col items-center w-full">
        <div 
          className={`flex flex-col items-center p-12 bg-primary rounded-3xl shadow-lg max-md:px-5 max-md:max-w-full transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95'
          } hover:shadow-xl hover:-translate-y-1`}
        >
          <div 
            className={`text-4xl font-bold tracking-tighter text-center text-primary-foreground max-md:max-w-full transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {showTypewriter ? (
              <div className="typewriter">
                Ready to transform your hotel operations?
              </div>
            ) : (
              <div style={{ visibility: 'hidden' }}>
                Ready to transform your hotel operations?
              </div>
            )}
          </div>
          
          <p 
            className={`mt-4 text-xl font-medium tracking-tight text-center text-primary-foreground/90 max-md:max-w-full transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            Join thousands of hotels already using Staywise to deliver exceptional guest experiences
          </p>
          
          <div 
            className={`flex gap-4 mt-10 max-md:flex-wrap max-md:max-w-full transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <button 
              onClick={handleStartFreeTrial}
              className="group flex overflow-hidden justify-center items-center px-8 py-3 text-base font-medium tracking-tight text-center text-primary whitespace-nowrap bg-primary-foreground rounded-xl border border-primary-foreground border-solid shadow-[0px_1px_0px_rgba(27,31,35,0.2)] hover:bg-primary-foreground/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg max-md:px-5"
            >
              Start your free trial
            </button>
            <button
              onClick={handleScheduleDemo}
              className="group flex justify-center items-center px-6 py-3 text-base font-medium tracking-tight text-center text-primary-foreground whitespace-nowrap bg-transparent rounded-xl border border-primary-foreground border-solid hover:bg-primary-foreground/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg max-md:px-5"
            >
              Schedule a demo
            </button>
          </div>
          
          <div 
            className={`flex gap-1 mt-6 text-sm text-primary-foreground/90 max-md:flex-wrap max-md:max-w-full transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          ><div className="flex items-center space-x-2">
          <span className="text-xl animate-spin-slow">•</span>
          <span className="group hover:text-primary-foreground transition-colors duration-300">No credit card required</span>
          <span className="text-xl animate-spin-slow">•</span>
          <span className="group hover:text-primary-foreground transition-colors duration-300">14-day free trial</span>
          <span className="text-xl animate-spin-slow">•</span>
          <span className="group hover:text-primary-foreground transition-colors duration-300">Cancel anytime</span>
        </div>
        
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 