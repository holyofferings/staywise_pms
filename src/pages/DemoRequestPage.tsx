import React from "react";
import Header from "@/components/landing/Header";
import DemoRequestSection from "@/components/landing/DemoRequestSection";
import InfiniteTestimonialsScroll from "@/components/landing/TestimonialsGrid";
import Footer from "@/components/landing/Footer";

const DemoRequestPage = () => {
  return (
    <main className="bg-background">
      <Header />
      <DemoRequestSection />
      <InfiniteTestimonialsScroll />
      <Footer />
    </main>
  );
};

export default DemoRequestPage; 