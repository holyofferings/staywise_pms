import React, { useState } from "react";
import { StaywiseButton } from "@/components/ui/StaywiseButton";

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
    name: "Enterprises",
    price: "₹20,000",
    period: "/year",
    description: "Comprehensive solutions tailored for large-scale business success.",
    button: { label: "Schedule a call", action: () => {}, variant: "primary" },
    features: [
      "Everything in Professional",
      "Room management (up to 50 rooms) with Google Calendar integration",
      "Custom chatbot development",
      "24hr priority support",
      "AI-Generated Marketing Templates (WhatsApp, Email, Discount Deals)\nUtilization a month",
      "WhatsApp Order Management (view food/service orders via Google chatbot)",
    ],
  },
];

export const PricingSection: React.FC = () => {
  const [billing, setBilling] = useState<'annually' | 'monthly'>('annually');

  return (
    <section id="pricing" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-4xl font-medium text-foreground mb-2">Pricing</h2>
          <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1 mt-2">
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${billing === 'annually' ? 'bg-primary text-primary-foreground' : 'text-foreground/70'}`}
              onClick={() => setBilling('annually')}
            >
              Annually
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-foreground/70'}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className="rounded-2xl bg-card/80 border border-border shadow-lg flex flex-col p-8"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg text-foreground/80 font-medium">{plan.name}</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                <span className="text-base text-foreground/60">{plan.period}</span>
              </div>
              <div className="mb-6 text-foreground/70 text-sm min-h-[48px]">{plan.description}</div>
              <StaywiseButton
                variant="primary"
                className="w-full mb-6 justify-center"
                onClick={plan.button.action}
              >
                {plan.button.label} <span className="ml-2">↗</span>
              </StaywiseButton>
              <ul className="flex flex-col gap-3 mt-auto">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm">
                    <span className="mt-1">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 6l-6.5 6.5L4 9"/></svg>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 