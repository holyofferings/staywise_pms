"use client";
import React from "react";

const PoweredBySection = () => {
  const partners = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/7aeeac1b87c2c3d4a7c5c8acbf4c39d6d5bf7ab2?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/c1f1dba82e5e2fd17faa9c6f5e37cae29c4bdcba?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/be02ff3a0fa04f6c3b4a28ab2c0c18e0edca1d0b?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/3651df5d347e13cb5e5e50ef6eb8783a2c9efcd9?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/aa96c09ece1d53fed8b00fe5f9e3ebbecd46f0ba?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
    "https://cdn.builder.io/api/v1/image/assets/TEMP/b0dc1a3db9a9e5c97ad70dc4eed5dad6db4e1fce?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
  ];

  return (
    <section className="flex flex-col items-center px-8 pt-20 pb-20 w-full bg-background max-md:px-5 max-md:pt-16 max-md:pb-16 max-md:max-w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center w-full">
        <h2 className="text-center text-4xl font-bold tracking-tighter text-foreground max-md:max-w-full">
          Powered by the most innovative technologies
        </h2>
        <p className="mt-4 text-xl font-medium tracking-tight text-center text-foreground/80 max-md:max-w-full">
          Our hotel management platform leverages cutting-edge AI and cloud technologies 
          to deliver exceptional performance
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 mt-12 max-w-full w-[1242px] max-md:mt-8 max-md:max-w-full">
          {partners.map((logoSrc, index) => (
            <div 
              key={index}
              className="flex flex-col justify-center items-center aspect-[2.73] w-[174px]"
            >
              <img
                src={logoSrc}
                className="object-contain w-full aspect-[2.73]"
                alt={`Technology partner ${index + 1}`}
              />
            </div>
          ))}
        </div>
        
        <p className="mt-10 text-base font-medium tracking-normal leading-6 text-center text-foreground/60 max-md:mt-8 max-md:max-w-full">
          These partnerships enable us to stay ahead of the curve in hotel technology
        </p>
      </div>
    </section>
  );
};

export default PoweredBySection; 