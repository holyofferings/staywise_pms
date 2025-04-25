import React from "react";
import { Button } from "@/components/ui/Button";

export const Hero: React.FC = () => {
  const arrowIcon = (
    <div
      dangerouslySetInnerHTML={{
        __html:
          '<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="button-icon" style="width: 16px; height: 16px"> <path d="M5.06669 11.3334L11.7334 4.66669" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.06669 4.66669H11.7334V11.3334" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
      }}
    />
  );

  return (
    <section className="flex flex-col items-center w-full pt-[180px] pb-[100px] px-10">
      <div className="flex flex-col items-center gap-8">
        <h1 className="flex flex-col items-center text-white text-6xl font-medium leading-[66px] tracking-[-1.2px] text-center">
          <span>Elevate Your Hotel Operations with</span>
          <span>AI-Driven Guest Management</span>
        </h1>
        <p className="flex flex-col items-center text-[rgba(255,255,255,0.8)] text-lg font-normal leading-[27px] tracking-[-0.36px] text-center">
          <span>
            Experience the future of Hotels with intelligent, scalable
          </span>
          <span>automation and AI solutions tailored to your needs</span>
        </p>
        <div className="flex gap-[15px]">
          <Button variant="primary" icon={arrowIcon}>
            Our Services
          </Button>
          <Button variant="secondary">See Plans</Button>
        </div>
      </div>
    </section>
  );
};
