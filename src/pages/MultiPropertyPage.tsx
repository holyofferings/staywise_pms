import React from "react";
import Header from "@/components/landing/Header";
import MultiPropertySection from "@/components/landing/MultiPropertySection";
import InfiniteTestimonialsScroll from "@/components/landing/TestimonialsGrid";
import Footer from "@/components/landing/Footer";

const MultiPropertyPage = () => {
  return (
    <main className="bg-background">
      <Header />
      <MultiPropertySection />
      <InfiniteTestimonialsScroll />
      <Footer />
    </main>
  );
};

export default MultiPropertyPage; 