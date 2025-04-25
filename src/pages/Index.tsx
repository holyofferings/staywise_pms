import React from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { HeroImage } from "@/components/home/HeroImage";
import { Partners } from "@/components/home/Partners";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { ContactForm } from "@/components/home/ContactForm";

const Index: React.FC = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <div className="flex flex-col items-center w-full bg-black min-h-screen">
        <Header />
        <main>
          <Hero />
          <HeroImage />
          <Partners />
          <About />
          <Services />
          <ContactForm />
        </main>
        <footer className="w-full py-8 text-center text-[rgba(255,255,255,0.6)] text-sm">
          <p>© {new Date().getFullYear()} Staywise. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Index;
