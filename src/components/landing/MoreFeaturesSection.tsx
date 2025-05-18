"use client";
import React from "react";
import '../../styles/animations.css';

const MoreFeaturesSection = () => {
  const features = [
    {
      icon: "public/images/ai-technology_18830138.png",
      title: "AI-Powered Recommendations",
      description: "Smart suggestions for room pricing and promotions based on market trends and guest history"
    },
    {
      icon: "public/images/sweep_18995967.png",
      title: "Automated Housekeeping",
      description: "Intelligent scheduling and task assignment for cleaning staff with real-time status updates"
    },
    {
      icon: "public/images/network-analytic_14644373.png",
      title: "Multi-Channel Booking",
      description: "Centralize reservations from all online travel agencies and your own website in one dashboard"
    },
    {
      icon: "public/images/meeting_13085465.png",
      title: "Guest Communication Hub",
      description: "Automated messaging for pre-arrival, during stay, and post-checkout with translation capabilities"
    },
    {
      icon: "public/images/chart-mixed_10483560.png",
      title: "Financial Analytics",
      description: "Comprehensive reporting on revenue, occupancy trends, and expense tracking with forecast projections"
    },
    {
      icon: "public/images/digital-payment_17525023.png",
      title: "Mobile Check-In/Out",
      description: "Contactless arrival and departure process for guests with digital key card integration"
    }
  ];

  return (
    <section className="flex items-start px-16 pt-20 pb-20 w-full bg-background max-md:px-5 max-md:pt-16 max-md:pb-16 max-md:max-w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 w-full max-md:gap-10 max-md:max-w-full">
        <div className="flex flex-col max-w-full">
          <h2 className="self-center text-5xl font-bold tracking-tighter leading-[57px] text-center text-foreground max-md:max-w-full max-md:text-4xl max-md:leading-[52px]">
            Everything you need for efficient<br />hotel management
          </h2>
          <p className="self-center mt-4 text-2xl font-medium tracking-tight leading-8 text-center text-foreground/80 max-md:max-w-full">
            Designed specifically for budget and mid-scale hotels looking to compete with larger chains
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-md:max-w-full">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex flex-col gap-4 p-6 border border-border bg-background rounded-3xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 cursor-pointer"
            >
              <div className="flex overflow-hidden justify-center items-start w-12 h-12 rounded-lg bg-primary/10 transition-transform duration-300 ease-in-out group-hover:scale-110">
                <img
                  src={feature.icon}
                  className="object-contain w-6 aspect-square m-3 transition-transform duration-300 group-hover:scale-110"
                  alt={feature.title}
                />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                {feature.title}
              </h3>
              <p className="text-base font-medium leading-6 text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreFeaturesSection; 