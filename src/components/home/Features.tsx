import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Features: React.FC = () => {
  const features = [
    {
      title: "AI-Powered Guest Management",
      description: "Automate guest communications and support with our smart AI assistant that handles inquiries, provides information, and escalates when needed.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
            }}
          />
        </div>
      ),
    },
    {
      title: "Smart Room Management",
      description: "Optimize room allocation, track maintenance needs, and streamline cleaning schedules through our intuitive dashboard.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
            }}
          />
        </div>
      ),
    },
    {
      title: "Automated Marketing",
      description: "Create personalized marketing campaigns with AI-generated content optimized for WhatsApp, email, and SMS channels.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
            }}
          />
        </div>
      ),
    },
    {
      title: "Booking Management",
      description: "Streamline reservations, manage check-ins/check-outs, and sync with popular OTAs all in one place.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
            }}
          />
        </div>
      ),
    },
    {
      title: "WhatsApp Integration",
      description: "Offer contactless room service through WhatsApp, sending and receiving orders directly through our platform.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
            }}
          />
        </div>
      ),
    },
    {
      title: "Revenue Analytics",
      description: "Track your hotel's performance with detailed analytics and AI-powered recommendations to maximize revenue.",
      icon: (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="w-full py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-foreground text-4xl font-medium leading-tight mb-4">
            Features designed for modern hotels
          </h2>
          <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
            Our platform helps budget hotels compete with luxury chains by providing AI-powered tools that automate operations, enhance guest experiences, and drive revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/30 border-border text-card-foreground">
              <CardHeader>
                {feature.icon}
                <CardTitle className="mt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/70">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
