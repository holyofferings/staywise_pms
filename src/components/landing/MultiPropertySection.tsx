"use client";
import React, { useState } from "react";
import { StaywiseButton } from "@/components/ui/StaywiseButton";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";

const MultiPropertySection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    message: ""
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

  // Pricing data for multi-property plans
  const pricingPlans = [
    {
      title: "Small Chain",
      description: "Perfect for small hotel groups with 2-5 properties",
      price: {
        monthly: 199,
        annually: 179
      },
      features: [
        "Up to 5 properties",
        "Centralized dashboard",
        "Cross-property booking",
        "Chain-wide reporting",
        "Shared guest database",
        "Multi-property inventory"
      ]
    },
    {
      title: "Mid-Size Group",
      description: "Ideal for growing hotel groups with 6-15 properties",
      price: {
        monthly: 349,
        annually: 319
      },
      features: [
        "Up to 15 properties",
        "Advanced revenue management",
        "Multi-property loyalty program",
        "Chain-wide analytics",
        "Central reservation system",
        "API access for custom integrations"
      ]
    },
    {
      title: "Enterprise",
      description: "For large hotel chains with 16+ properties",
      price: {
        monthly: "Custom",
        annually: "Custom"
      },
      features: [
        "Unlimited properties",
        "Dedicated account manager",
        "White-labeled solutions",
        "Custom integrations",
        "Advanced security controls",
        "Training & onboarding for all staff"
      ]
    }
  ];

  const [billing, setBilling] = useState<'monthly' | 'annually'>('annually');

  return (
    <section className="relative overflow-hidden bg-background py-24">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tighter leading-[1.1] text-foreground mb-4">
            Multi-Property Management Solutions
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Streamline operations across your entire hotel portfolio with our multi-property management system
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 bg-muted/50 rounded-full p-1">
            <button
              onClick={() => setBilling('annually')}
              className={`px-6 py-2 rounded-full text-base font-medium transition-colors ${
                billing === 'annually' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              Bill Annually
              {billing === 'annually' && <span className="ml-2 text-xs opacity-80">Save 10%</span>}
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
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className="pricing-card bg-white rounded-xl shadow-lg overflow-hidden border border-border/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-6 border-b border-border/20">
                <h3 className="text-2xl font-semibold">{plan.title}</h3>
                <p className="text-foreground/70 mt-2">{plan.description}</p>
              </div>
              
              <div className="p-6 bg-muted/10">
                <div className="flex items-end gap-1 mb-4">
                  <span className="text-4xl font-bold">
                    {typeof plan.price[billing] === 'number' ? '$' : ''}
                    {plan.price[billing]}
                  </span>
                  {typeof plan.price[billing] === 'number' && (
                    <span className="text-foreground/70 mb-1">/month/property</span>
                  )}
                </div>
                
                <StaywiseButton
                  variant="primary"
                  className="w-full justify-center mb-4"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </StaywiseButton>
                
                <p className="text-xs text-foreground/60 text-center mb-4">
                  {plan.title === "Enterprise" 
                    ? "Contact us for custom pricing"
                    : `Billed ${billing === 'annually' ? 'annually' : 'monthly'}`
                  }
                </p>
              </div>
              
              <div className="p-6 space-y-3 expandable-features">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary/80 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                
                <div className="hidden extended-features pt-4 mt-4 border-t border-border/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary/80 flex-shrink-0" />
                    <span>24/7 premium support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary/80 flex-shrink-0" />
                    <span>Regular software updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary/80 flex-shrink-0" />
                    <span>Data migration assistance</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="bg-muted/30 rounded-2xl p-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">SEND US A MESSAGE</h3>
              <p className="text-foreground/70 mb-6">
                Have questions about our multi-property solutions? Contact us for more information.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm mb-1 font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
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
                    placeholder="your@email.com"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm mb-1 font-medium">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your company"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm mb-1 font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    rows={3}
                    required
                    className="w-full bg-background/20 border border-input rounded-md px-3 py-2 text-foreground placeholder:text-foreground/40 resize-none"
                  />
                </div>
                
                <StaywiseButton
                  type="submit"
                  variant="primary"
                  className="w-full justify-center"
                >
                  Send Message
                </StaywiseButton>
              </form>
            </div>
            
            <div>
              <img 
                src="/images/multi-property-illustration.jpg" 
                alt="Multi-property management" 
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS for hover animations */}
      <style jsx>{`
        .pricing-card {
          transition: all 0.3s ease;
        }
        
        .pricing-card:hover .expandable-features .extended-features {
          display: block;
          animation: fadeIn 0.5s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default MultiPropertySection; 