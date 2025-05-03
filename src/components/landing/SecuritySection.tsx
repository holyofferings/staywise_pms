import React, { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

const SecuritySection = () => {
  const { theme } = useTheme();
  
  // Ensure theme is properly applied when component mounts
  useEffect(() => {
    // Re-apply the current theme class to ensure proper styling
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);
  
  // Set the background color for security icons based on theme
  const iconBackgroundColor = theme === 'dark' ? '#000000' : '#ffffff';
  
  return (
    <section id="security" className="flex items-start px-16 pt-20 pb-20 w-full bg-background text-foreground max-md:px-5 max-md:pt-16 max-md:pb-16 max-md:max-w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 items-center w-full max-md:gap-10 max-md:max-w-full">
        <div className="flex gap-5 justify-between items-start self-stretch mx-8 max-md:flex-wrap max-md:mx-2.5 max-md:max-w-full">
          <div className="flex flex-col max-w-[595px]">
            <h2 className="text-5xl font-bold tracking-tighter leading-[57px] text-foreground max-md:max-w-full max-md:text-4xl max-md:leading-[52px]">
              The most secure hotel CRM
            </h2>
            <p className="mt-4 text-2xl font-medium tracking-tight leading-8 text-foreground/80 max-md:max-w-full">
              We take the trust you place in us very seriously, safeguarding your data with industry-leading security standards.
            </p>
          </div>
          <div className="flex flex-col rounded-xl shadow-sm basis-0">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a8fb9553dbd4b3c0fca0b4ef07ae9b9ff621cf9?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
              className={`shrink-0 max-w-full rounded-xl aspect-[3.97] w-[248px]`}
              style={{ backgroundColor: iconBackgroundColor }}
              alt="Security certification badge"
            />
          </div>
        </div>
        <div className="flex gap-5 justify-center items-start max-w-full w-[1312px] max-md:flex-wrap max-md:max-w-full">
          {[
            {
              icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/24cd9d17c60e75d8a76fd0d7e295172ef1def4b9?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
              title: "GDPR Compliant",
              description: "Fully compliant with data privacy regulations protecting guest information"
            },
            {
              icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a3ee2aad0b1c3f8eabdc7ce8f8d98a19b0f34c95?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
              title: "AES-256 Encryption",
              description: "Military-grade encryption for all stored data and communications"
            },
            {
              icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/8eb53c7ca96be2d3e8b37b05c06a6f42f9e9d4ef?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
              title: "SOC 2 Type II",
              description: "Certified secure operations and infrastructure with annual audits"
            }
          ].map((item, index) => (
            <div 
              key={index}
              className="flex flex-col flex-1 px-8 py-10 bg-background rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full"
            >
              <img
                src={item.icon}
                className="self-center max-w-full aspect-square w-[92px]"
                style={{ backgroundColor: iconBackgroundColor, borderRadius: '8px' }}
                alt={item.title}
              />
              <h3 className="self-center mt-4 text-xl font-semibold tracking-tight text-center text-foreground">
                {item.title}
              </h3>
              <p className="self-center mt-3 text-base font-medium tracking-tight text-center text-foreground/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection; 