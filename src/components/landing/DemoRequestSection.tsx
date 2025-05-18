"use client";
import React, { useState } from "react";
import { StaywiseButton } from "@/components/ui/StaywiseButton";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

const DemoRequestSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    city: "",
    requirements: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <section className="relative overflow-hidden bg-background min-h-[900px] flex items-center">
      {/* Background gradient and patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-r from-blue-50 via-purple-50 to-orange-50 opacity-50"></div>
        <div className="absolute top-[300px] left-[10%] w-[300px] h-[300px] rounded-full bg-blue-200 mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute top-[400px] right-[15%] w-[350px] h-[350px] rounded-full bg-purple-200 mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[250px] h-[250px] rounded-full bg-orange-200 mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 pt-16 pb-24 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="flex flex-col space-y-8">
            {/* Headline */}
            <h1 className="text-6xl font-bold tracking-tighter leading-[1.1] text-foreground max-w-xl">
              Request a Demo of Staywise PMS
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-foreground/80 max-w-lg">
              See how our hotel management system can transform your operations and delight your guests.
            </p>
            
            {/* Benefits */}
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <img src="/images/sweep_18995967.png" alt="Easy Onboarding" className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">Personalized Demo Tailored to Your Needs</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <img src="/images/network-analytic_14644416.png" alt="Cloud-based" className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">Live Walkthrough of All Features</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <img src="/images/meeting_13085465.png" alt="24/7 Support" className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">Q&A with Product Specialists</span>
              </li>
            </ul>
            
            {/* Trust signals */}
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-foreground/70 font-medium">TRUSTED BY LEADING HOTELS WORLDWIDE</p>
              <div className="flex flex-wrap gap-6 items-center">
                <img src="/images/client-logo-1.png" alt="Client 1" className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                <img src="/images/client-logo-2.png" alt="Client 2" className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                <img src="/images/client-logo-3.png" alt="Client 3" className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                <img src="/images/client-logo-4.png" alt="Client 4" className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
              </div>
            </div>
          </div>
          
          {/* Right column - Form */}
          <div className="relative">
            {/* Floating banner with scrolling text */}
            <div className="absolute -top-12 left-0 right-0 overflow-hidden">
              <div className="banner-scroll-container py-2 bg-primary rounded-full shadow-lg">
                <div className="banner-scroll-text">
                  <span className="text-sm font-medium text-primary-foreground whitespace-nowrap">🎉 Schedule a Free Demo Today</span>
                  <span className="text-sm font-medium text-primary-foreground whitespace-nowrap px-8">✨ Personalized for Your Hotel</span>
                  <span className="text-sm font-medium text-primary-foreground whitespace-nowrap px-8">🔒 No Obligations</span>
                  <span className="text-sm font-medium text-primary-foreground whitespace-nowrap px-8">🎉 Schedule a Free Demo Today</span>
                </div>
              </div>
            </div>
            
            {/* Form container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-border/50 mt-6">
              <h3 className="text-2xl font-semibold mb-6">Request Your Demo</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fullName" className="block text-sm mb-1 font-medium">
                    Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm mb-1 font-medium">
                    Hotel / Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Staywise Hotel"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm mb-1 font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm mb-1 font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (123) 456-7890"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm mb-1 font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm mb-1 font-medium">
                    What would you like to see in the demo?
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Tell us about your specific requirements and interests..."
                    rows={3}
                    required
                    className="w-full bg-background/20 border border-input rounded-md px-3 py-2 text-foreground placeholder:text-foreground/40 resize-none"
                  />
                </div>
                
                <div className="pt-2 space-y-3">
                  <StaywiseButton
                    type="submit"
                    variant="primary"
                    className="w-full justify-center text-base py-3"
                  >
                    Schedule Demo
                  </StaywiseButton>
                  
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3 border border-border rounded-lg text-foreground font-medium hover:bg-muted/50 transition-colors"
                  >
                    <MessageSquare size={18} />
                    <span>Talk to Sales</span>
                  </button>
                  
                  <div className="text-center mt-4">
                    <a href="#" className="flex items-center justify-center gap-2 text-sm text-foreground/70 hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                      </svg>
                      Contact on WhatsApp
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for banner scroll animation */}
      <style jsx>{`
        .banner-scroll-container {
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 20px;
          padding-right: 20px;
        }

        .banner-scroll-text {
          display: flex;
          white-space: nowrap;
          animation: banner-scroll 20s linear infinite;
        }

        @keyframes banner-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .banner-scroll-container:hover .banner-scroll-text {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default DemoRequestSection; 