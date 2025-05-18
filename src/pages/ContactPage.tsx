import React from "react";
import Header from "@/components/landing/Header";
import ContactHeroSection from "@/components/landing/ContactHeroSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

const ContactPage = () => {
  return (
    <main className="bg-background">
      <Header />
      <ContactHeroSection />
      <FAQSection />
      <Footer />
    </main>
  );
};

export default ContactPage; 