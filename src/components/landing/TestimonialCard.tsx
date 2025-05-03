"use client";
import React from "react";

interface TestimonialCardProps {
  logoSrc: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorImageSrc: string;
  readFullStory?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  logoSrc,
  quote,
  authorName,
  authorRole,
  authorImageSrc,
  readFullStory = false
}) => {
  return (
    <div className="flex flex-col items-start px-10 pt-8 pb-8 mt-16 bg-muted/30 rounded-3xl max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between w-full max-md:max-w-full">
        <div className="flex overflow-hidden justify-center items-start w-[105px]">
          <img
            src={logoSrc}
            className="object-contain aspect-[2.39] w-[105px]"
            alt="Company logo"
          />
        </div>
        {readFullStory && (
          <a
            href="#"
            className="flex gap-2 justify-center items-center px-3 my-auto h-9 text-sm font-medium tracking-tight leading-5 text-primary whitespace-nowrap"
          >
            Read full story
            <div className="flex overflow-hidden justify-center items-start self-stretch my-auto w-[18px]">
              <div className="flex items-start px-2 py-1.5 w-[18px]">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/c58a84aa6109cf781e10debd36a30032af5b69c5?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
                  className="object-contain aspect-[0.37] w-[3px]"
                  alt="Arrow icon"
                />
              </div>
            </div>
          </a>
        )}
      </div>
      <p className="mt-7 text-xl font-medium leading-8 text-foreground max-md:max-w-full">
        "{quote}"
      </p>
      <div className="flex gap-3 justify-between self-stretch mt-6 w-full max-md:flex-wrap max-md:max-w-full">
        <div className="flex gap-2 justify-between">
          <img
            src={authorImageSrc}
            className="shrink-0 w-10 aspect-square rounded-full"
            alt={authorName}
          />
          <div className="flex flex-col grow shrink-0 my-auto basis-0">
            <div className="text-sm font-medium leading-5 text-foreground">
              {authorName}
            </div>
            <div className="text-sm leading-5 text-foreground/60">
              {authorRole}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 