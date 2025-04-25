import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Features } from "@/components/home/Features";
import { Services } from "@/components/home/Services";
import { ContactForm } from "@/components/home/ContactForm";
import { DemoRequestForm } from "@/components/home/DemoRequestForm";

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full bg-black min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Services />
        
        {/* Demo Request Section */}
        <section id="demo-request" className="w-full py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-white text-4xl font-medium leading-tight mb-6">
                Ready to transform your hotel operations?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Request a personalized demo to see how Staywise can help your budget hotel compete with luxury chains by leveraging AI-powered automation.
              </p>
              <ul className="space-y-4">
                {[
                  "Free consultation with our hotel tech experts",
                  "See real examples of AI automation for your specific needs",
                  "Learn how similar hotels have increased revenue by 25%",
                  "No obligation, no pressure sales approach",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="text-[#512FEB]">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>',
                        }}
                      />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <DemoRequestForm />
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact">
          <ContactForm />
        </section>
      </main>
      <footer className="w-full py-12 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 24px; height: 24px; opacity: 0.9"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="white"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="white"></rect> </clipPath> </defs> </svg>',
                    }}
                  />
                </div>
                <span className="text-white text-md font-medium leading-[16.8px]">
                  Staywise
                </span>
              </Link>
              <p className="text-white/60 text-sm mb-4">
                AI-powered hotel management platform for budget hotels
              </p>
              <div className="flex gap-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <a 
                    key={social}
                    href={`#${social}`} 
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full">
                      Icon
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Case Studies", "Reviews", "Updates"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Careers", "Contact", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Terms", "Privacy", "Cookie Policy", "Licenses"].map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © {new Date().getFullYear()} Staywise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
