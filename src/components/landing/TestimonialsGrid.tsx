"use client";
import React from "react";

const TestimonialsGrid = () => {
  const testimonials = [
    {
      quote: "Staywise has transformed our operations. We've reduced check-in time by 80% and increased our occupancy rate by 15% in just three months.",
      author: "Priya Sharma",
      role: "Manager, Serene Stays Jaipur",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/94bc8c43a0161e7acfea3f697b09d01abd5eb3fa?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
    },
    {
      quote: "The automated housekeeping system has been a game-changer. Our rooms are ready faster, and guest complaints about cleanliness have dropped to almost zero.",
      author: "Raj Malhotra",
      role: "Owner, Mountain View Resort",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/392320b135954220f21fad387876d170f21bbe26?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
    },
    {
      quote: "As a small hotel, we never thought we could afford such advanced technology. Staywise is not only affordable but has paid for itself within the first two months.",
      author: "Sarah Johnson",
      role: "Director, Coastal Breeze Inn",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/912d78a958c63936f23a495ad7d8ddf2ebc2c49f?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
    },
    {
      quote: "The AI-powered pricing recommendations have completely changed our revenue strategy. We're now making 22% more during peak seasons.",
      author: "Michael Chen",
      role: "Revenue Manager, City Central Hotel",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/94bc8c43a0161e7acfea3f697b09d01abd5eb3fa?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256"
    }
  ];

  return (
    <section className="flex flex-col items-center px-16 pt-32 pb-32 w-full bg-muted/30 max-md:px-5 max-md:pt-24 max-md:pb-24 max-md:max-w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center w-full">
        <h2 className="self-center text-5xl font-bold tracking-tighter leading-[57px] text-center text-foreground max-md:max-w-full max-md:text-4xl max-md:leading-[52px]">
          Loved by hoteliers worldwide
        </h2>
        <p className="self-center mt-4 text-2xl font-medium tracking-tight leading-8 text-center text-foreground/80 max-md:max-w-full">
          See how budget hotels across the globe are transforming with Staywise
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-md:mt-10 max-md:max-w-full">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="flex flex-col p-8 bg-background rounded-3xl shadow-sm max-md:px-5"
            >
              <p className="text-xl font-medium leading-8 text-foreground max-md:max-w-full">
                "{testimonial.quote}"
              </p>
              <div className="flex gap-3 mt-8">
                <img
                  src={testimonial.image}
                  className="shrink-0 w-12 h-12 rounded-full"
                  alt={testimonial.author}
                />
                <div className="flex flex-col my-auto">
                  <div className="text-base font-semibold text-foreground">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-foreground/70">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGrid; 