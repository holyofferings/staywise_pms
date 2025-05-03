"use client";
import React from "react";

const MoreFeaturesSection = () => {
  const features = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd0b7fbf7dc32e17c9fd7af1b2bd18c00c62c9ef?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      title: "AI-Powered Recommendations",
      description: "Smart suggestions for room pricing and promotions based on market trends and guest history"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/facc9f0cb7d9b42eed2a1e94cf7e4c123d3c17b5?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      title: "Automated Housekeeping",
      description: "Intelligent scheduling and task assignment for cleaning staff with real-time status updates"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/7a38caa0e05e0915a0ca3b69ea2d3e5301d41f62?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      title: "Multi-Channel Booking",
      description: "Centralize reservations from all online travel agencies and your own website in one dashboard"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a18da3eb5b52bbfc0e1fa0c6d7d40c5b903e9de?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      title: "Guest Communication Hub",
      description: "Automated messaging for pre-arrival, during stay, and post-checkout with translation capabilities"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f90b6e2bc6f3acbe9afbbd0c0dc5a8a60b0e08db?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      title: "Financial Analytics",
      description: "Comprehensive reporting on revenue, occupancy trends, and expense tracking with forecast projections"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/77ec8b2d74fc2f11b21f3f6ebcdc2d95c6c20b24?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
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
            <div key={index} className="flex flex-col gap-4 p-6 bg-background rounded-3xl shadow-sm max-md:px-5">
              <div className="flex overflow-hidden justify-center items-start w-12 h-12 rounded-lg bg-primary/10">
                <img
                  src={feature.icon}
                  className="object-contain w-6 aspect-square m-3"
                  alt={feature.title}
                />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="text-base font-medium leading-6 text-foreground/80">
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