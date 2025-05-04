"use client";
import React, { useState } from "react";

const plans = [
  {
    name: "Basic",
    price: "₹6,000",
    period: "/year",
    description: "Essential tools and features for starting your journey with ease.",
    button: { label: "Go with this plan", action: () => {}, variant: "primary" },
    features: [
      "Full room and booking management (up to 15 rooms)",
      "Dashboard with overview cards (Total Bookings, Active Rooms, Revenue This Month)",
      "Unlimited contacts & users (add staff and guests as needed)",
      "Setup up to 3 sub-accounts (e.g., for multiple departments or small properties)",
      "Billing with Custom Edit Options (generate and edit invoices for bookings, e.g., add GST, discounts)",
    ],
  },
  {
    name: "Professional",
    price: "₹10,000",
    period: "/year",
    description: "Advanced capabilities designed to meet growing business needs.",
    button: { label: "Go with this plan", action: () => {}, variant: "primary" },
    features: [
      "Everything in Basic",
      "Room management (up to 25 rooms) with Google Calendar integration",
      "AI Sales Agent with basic sales scripts and preview mode",
      "AI Automation (trigger-based flows: Booking Created, Check-In, Check-Out → Send WhatsApp/SMS/Email)",
      "Dashboard with overview cards (Total Bookings, Active Rooms, Revenue) and Reports (booking trends, revenue analysis, occupancy rates)",
    ],
  },
  {
    name: "Enterprise",
    price: "₹20,000",
    period: "/year",
    description: "Comprehensive solutions tailored for large-scale business success.",
    button: { label: "Schedule a call", action: () => {}, variant: "primary" },
    features: [
      "Everything in Professional",
      "Room management (up to 50 rooms) with Google Calendar integration",
      "Custom chatbot development",
      "24hr priority support",
      "AI-Generated Marketing Templates (WhatsApp, Email, Discount Deals)",
      "WhatsApp Order Management (view food/service orders via Google chatbot)",
    ],
  },
];

const PricingSection = () => {
  const [billing, setBilling] = useState<'annually' | 'monthly'>('annually');

  const toggleBilling = () => {
    setBilling(billing === 'annually' ? 'monthly' : 'annually');
  }

  // Function to get the adjusted price based on billing period
  const getPrice = (price: string, period: string, planName: string) => {
    if (billing === 'monthly') {
      // Use fixed monthly prices based on plan name
      if (planName === "Basic") return "₹800";
      if (planName === "Professional") return "₹1200";
      if (planName === "Enterprise") return "₹2200";
    }
    return price;
  };

  // Function to get the period text based on billing period
  const getPeriod = () => {
    return billing === 'annually' ? '/year' : '/month';
  };

  return (
    <section id="pricing" className="flex flex-col items-center px-16 pt-20 pb-20 w-full bg-background max-md:px-5 max-md:pt-16 max-md:pb-16 max-md:max-w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center w-full">
        <h2 className="self-center text-5xl font-bold tracking-tighter leading-[57px] text-center text-foreground max-md:max-w-full max-md:text-4xl max-md:leading-[52px]">
          Choose the right plan for you
        </h2>
        <p className="self-center mt-4 text-2xl font-medium tracking-tight leading-8 text-center text-foreground/80 max-md:max-w-full">
          Simple pricing for hotels of all sizes
        </p>
        
        <div className="flex items-center gap-3 mt-8 bg-muted/50 rounded-full p-1">
          <button
            onClick={() => setBilling('annually')}
            className={`px-6 py-2 rounded-full text-base font-medium transition-colors ${
              billing === 'annually' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            Bill Annually
          </button>
          <button
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2 rounded-full text-base font-medium transition-colors ${
              billing === 'monthly' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            Bill Monthly
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className="flex flex-col p-6 bg-background rounded-3xl shadow-sm border border-border/50 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-2xl font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-2 text-foreground/80 text-base min-h-[50px]">
                {plan.description}
              </p>
              
              <div className="flex items-baseline mt-4 mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {getPrice(plan.price, plan.period, plan.name)}
                </span>
                <span className="ml-2 text-foreground/70">
                  {getPeriod()}
                </span>
              </div>
              
              <a 
                href="#" 
                className={`flex justify-center items-center px-4 py-3 text-base font-medium tracking-tight text-center rounded-xl ${
                  plan.name === "Professional"
                    ? "bg-primary text-primary-foreground border border-primary shadow-[0px_1px_0px_rgba(27,31,35,0.2)]"
                    : "border border-border text-foreground hover:border-primary/50 transition-colors"
                }`}
              >
                {plan.button.label}
              </a>
              
              <div className="mt-6">
                <div className="text-sm font-medium text-foreground/80 mb-3">
                  WHAT'S INCLUDED
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/80 text-sm">
                      <div className="flex-shrink-0 mt-1 text-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 