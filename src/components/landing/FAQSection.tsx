"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// FAQ item interface
interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection = () => {
  // FAQ data with questions and answers about the hotel management software
  const faqs: FAQItem[] = [
    {
      question: "How easy is it to migrate from my current hotel management system?",
      answer: "Staywise offers a seamless migration process with dedicated onboarding specialists. Our team handles data transfer from your existing system, typically completing the entire process within 3-5 business days with minimal disruption to your operations. We provide comprehensive training to ensure your staff is comfortable with the new system before going live."
    },
    {
      question: "Does Staywise integrate with booking platforms like Booking.com and Expedia?",
      answer: "Yes, Staywise seamlessly integrates with all major Online Travel Agencies (OTAs) including Booking.com, Expedia, Agoda, MakeMyTrip, and others. Our channel manager automatically syncs inventory and rates across all platforms in real-time, eliminating the risk of double bookings and ensuring rate parity."
    },
    {
      question: "What kind of customer support does Staywise provide?",
      answer: "We offer 24/7 customer support through multiple channels including live chat, email, and phone. Our support team is specifically trained in hospitality operations and can assist with technical issues, feature requests, and best practices. Premium plans include a dedicated account manager who understands your specific business needs."
    },
    {
      question: "Can Staywise handle multiple properties under one account?",
      answer: "Absolutely! Our multi-property management feature allows you to manage unlimited properties from a single dashboard. You can set different permission levels for staff at each location while maintaining centralized reporting and analytics. This makes Staywise perfect for hotel groups, chains, and management companies overseeing multiple properties."
    },
    {
      question: "How does Staywise's AI pricing recommendation system work?",
      answer: "Our AI-powered dynamic pricing engine analyzes over 20 factors including historical data, competitor rates, demand patterns, local events, and seasonal trends. It then automatically suggests optimal room rates to maximize revenue. Hotels using our AI pricing typically see a 15-22% increase in RevPAR within the first three months. You maintain full control and can set parameters for minimum and maximum rates."
    },
    {
      question: "Is there a contract lock-in period?",
      answer: "We offer both monthly and annual subscription options with no long-term contracts required. Annual plans come with a significant discount compared to monthly billing. We're confident in our product, which is why we don't believe in locking customers into lengthy contracts. You can upgrade, downgrade, or cancel your subscription at any time."
    }
  ];

  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  // Toggle FAQ item expansion
  const toggleItem = (index: number) => {
    setExpandedItems(prevItems => 
      prevItems.includes(index)
        ? prevItems.filter(item => item !== index)
        : [...prevItems, index]
    );
  };

  return (
    <section id="faq" className="flex flex-col items-center px-16 py-24 w-full bg-background text-foreground max-md:px-5 max-md:py-16">
      <div className="max-w-[1000px] mx-auto w-full">
        {/* Section header */}
        <div className="text-center mb-16 max-md:mb-10">
          <h2 className="text-5xl font-bold tracking-tighter leading-[1.1] mb-4 max-md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-foreground/80 max-w-[700px] mx-auto">
            Get answers to common questions about Staywise hotel management software
          </p>
        </div>

        {/* FAQ list */}
        <div className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-border rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {/* Question (always visible) */}
              <button
                onClick={() => toggleItem(index)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
              >
                <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                <ChevronDown 
                  className={`h-5 w-5 text-primary transition-transform duration-200 flex-shrink-0 ${
                    expandedItems.includes(index) ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Answer (visible when expanded) */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  expandedItems.includes(index) 
                    ? 'max-h-[500px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-6 text-foreground/80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional help section */}
        <div className="mt-12 text-center p-8 bg-muted/30 rounded-2xl border border-border">
          <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
          <p className="text-foreground/80 mb-6">
            Our team is ready to help you find the perfect solution for your hotel
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Contact Sales
            </button>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 