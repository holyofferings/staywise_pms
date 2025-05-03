"use client";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-12 bg-muted">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <a href="/" className="flex items-center gap-2 mb-4">
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 24px; height: 24px; opacity: 0.9"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="white"></rect> </clipPath> </defs> </svg>',
                  }}
                />
              </div>
              <span className="text-foreground text-md font-medium leading-[16.8px]">
                Staywise
              </span>
            </a>
            <p className="text-foreground/60 text-sm mb-4">
              AI-powered hotel management platform for budget hotels
            </p>
            <div className="flex gap-4">
              {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                <a 
                  key={social}
                  href={`#${social}`} 
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-8 h-8 flex items-center justify-center bg-foreground/5 rounded-full">
                    Icon
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Case Studies", "Reviews", "Updates"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-foreground/60 hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Careers", "Contact", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-foreground/60 hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              {["Terms", "Privacy", "Cookie Policy", "Licenses"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-foreground/60 hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-foreground/10 mt-12 pt-8 text-center">
          <p className="text-foreground/60 text-sm">
            © {new Date().getFullYear()} Staywise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 