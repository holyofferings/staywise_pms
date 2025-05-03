import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";
import SecuritySection from "./SecuritySection";
import PoweredBySection from "./PoweredBySection";
import MoreFeaturesSection from "./MoreFeaturesSection";
import TestimonialsGrid from "./TestimonialsGrid";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

const InputDesign = () => {
  return (
    <main className="pt-5 rounded-none bg-background">
      <Header />
      <HeroSection />

      <div id="features">
        <FeatureSection
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/c1a2b3a6dfbc1c3f2aa4ee55454f51de59845879?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
          title="Features Designed for Modern Hotels"
          description="Our platform helps budget hotels compete with luxury chains by providing AI-powered tools that automate operations, enhance guest experiences, and drive revenue."
          testimonial={{
            logoSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/efe571cc1ac4470f5e99a68074f5ee2425b466af?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
            quote: "My team loves Staywise's reporting system because it's so dynamic. We can splice our data in so many different ways and combinations.",
            authorName: "Ram Kishan",
            authorRole: "Lessor, Paradise Inn (Delhi)",
            authorImageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/94bc8c43a0161e7acfea3f697b09d01abd5eb3fa?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
          }}
        />
      </div>

      <FeatureSection
        iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/301f800de409fe5ee5ddd73944e4cee3eac5f00e?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
        title="Automated Bookings Creation"
        description="Your customers are always connected - why should your CRM be any different?"
        testimonial={{
          logoSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/a2890f4a5a6f4aed22a08b1b3219766974e92b95?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
          quote: "Staywise has played a crucial role in scaling, building out and evolving our go-to-market model. It allows my team to easily stay on top of everything.",
          authorName: "Alon Bartur",
          authorRole: "Co-founder & CEO, Dopt",
          authorImageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/392320b135954220f21fad387876d170f21bbe26?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
        }}
        readFullStory={true}
      />

      <FeatureSection
        iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/940fd925ff25b1e2ca02fb7faf2e9f6757158444?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
        title="Designed for multiplayer."
        description="The first truly multiplayer CRM. After all, the best work doesn't come from silos."
        testimonial={{
          logoSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/494118709315ccf7cdfdb1a5aafb0e8de60f4488?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
          quote: "Staywise is the most flexible CRM we've ever come across. We've been able to build a world-class go-to-market engine with it.",
          authorName: "Taimur Abdaal",
          authorRole: "Co-founder & CEO, Causal",
          authorImageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/912d78a958c63936f23a495ad7d8df2ebc2c49f?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
        }}
        isLastSection={true}
      />

      <PricingSection />
      <SecuritySection />
      <PoweredBySection />
      <MoreFeaturesSection />
      <TestimonialsGrid />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default InputDesign; 