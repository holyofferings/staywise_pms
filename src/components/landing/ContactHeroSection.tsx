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
                
                </div>
              </form>
            </div>
          </div>
        </div>
      
   
  );
    
};

export default DemoRequestSection; 