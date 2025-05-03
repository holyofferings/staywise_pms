import React from "react";
import { useNavigate } from 'react-router-dom';

const CtaSection = () => {
  const navigate = useNavigate();

  const handleStartFreeTrial = () => {
    navigate('/signup');
  };

  const handleScheduleDemo = () => {
    // This could lead to a contact form or direct to a calendar booking page
    // For now, we'll scroll to the pricing section which likely has contact info
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="flex items-start px-16 pt-32 pb-32 w-full bg-background max-md:px-5 max-md:pt-24 max-md:pb-24 max-md:max-w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center w-full">
        <div className="flex flex-col items-center p-12 bg-primary rounded-3xl shadow-lg max-md:px-5 max-md:max-w-full">
          <h2 className="text-4xl font-bold tracking-tighter text-center text-primary-foreground max-md:max-w-full">
            Ready to transform your hotel operations?
          </h2>
          <p className="mt-4 text-xl font-medium tracking-tight text-center text-primary-foreground/90 max-md:max-w-full">
            Join thousands of hotels already using Staywise to deliver exceptional guest experiences
          </p>
          
          <div className="flex gap-4 mt-10 max-md:flex-wrap max-md:max-w-full">
            <button 
              onClick={handleStartFreeTrial}
              className="flex overflow-hidden justify-center items-center px-8 py-3 text-base font-medium tracking-tight text-center text-primary whitespace-nowrap bg-primary-foreground rounded-xl border border-primary-foreground border-solid shadow-[0px_1px_0px_rgba(27,31,35,0.2)] hover:bg-primary-foreground/90 transition-colors max-md:px-5"
            >
              Start your free trial
            </button>
            <button
              onClick={handleScheduleDemo}
              className="flex justify-center items-center px-6 py-3 text-base font-medium tracking-tight text-center text-primary-foreground whitespace-nowrap bg-transparent rounded-xl border border-primary-foreground border-solid hover:bg-primary-foreground/10 transition-colors max-md:px-5"
            >
              Schedule a demo
            </button>
          </div>
          
          <div className="flex gap-1 mt-6 text-sm text-primary-foreground/90 max-md:flex-wrap max-md:max-w-full">
            <span>No credit card required</span>
            <span className="self-start mx-1.5 my-auto text-lg">•</span>
            <span>14-day free trial</span>
            <span className="self-start mx-1.5 my-auto text-lg">•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 