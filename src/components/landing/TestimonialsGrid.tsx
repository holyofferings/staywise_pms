"use client";
import React from "react";

const InfiniteTestimonialsScroll = () => {
  const testimonials = [
    {
      quote: "Staywise has transformed our operations. We've reduced check-in time by 80% and increased our occupancy rate by 15% in just three months.",
      author: "Priya Sharma",
      role: "Manager, Serene Stays Jaipur",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/94bc8c43a0161e7acfea3f697b09d01abd5eb3fa?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      rating: 5
    },
    {
      quote: "The automated housekeeping system has been a game-changer. Our rooms are ready faster, and guest complaints about cleanliness have dropped to almost zero.",
      author: "Raj Malhotra",
      role: "Owner, Mountain View Resort",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/392320b135954220f21fad387876d170f21bbe26?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      rating: 5
    },
    {
      quote: "As a small hotel, we never thought we could afford such advanced technology. Staywise is not only affordable but has paid for itself within the first two months.",
      author: "Sarah Johnson",
      role: "Director, Coastal Breeze Inn",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/912d78a958c63936f23a495ad7d8ddf2ebc2c49f?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      rating: 4
    },
    {
      quote: "The AI-powered pricing recommendations have completely changed our revenue strategy. We're now making 22% more during peak seasons.",
      author: "Michael Chen",
      role: "Revenue Manager, City Central Hotel",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/94bc8c43a0161e7acfea3f697b09d01abd5eb3fa?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      rating: 5
    },
    // Duplicate testimonials to ensure smooth infinite scrolling
    {
      quote: "The WhatsApp integration helps us communicate with guests instantly. Our response time has improved dramatically.",
      author: "Anita Desai",
      role: "Front Desk Manager, Royal Palms",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/912d78a958c63936f23a495ad7d8ddf2ebc2c49f?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      rating: 5
    },
    {
      quote: "Guest profiles help us personalize every stay. Returning customers are delighted when we remember their preferences.",
      author: "David Kumar",
      role: "Customer Relations, Sunset Beach Resort",
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/392320b135954220f21fad387876d170f21bbe26?placeholderIfAbsent=true&apiKey=602006ab0872494795ebb36066caa256",
      rating: 4
    }
  ];

  // Helper function to display stars
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={`text-lg ${i < rating ? "text-amber-400" : "text-gray-300"}`}>
          ★
        </span>
      ));
  };

  // Render a single testimonial card
  const renderTestimonialCard = (testimonial: any, index: number, isDuplicate: boolean = false) => {
    return (
      <div 
        key={isDuplicate ? `duplicate-${index}` : index} 
        className="testimonial-card"
      >
        {/* Star rating */}
        <div className="stars-container">
          {renderStars(testimonial.rating)}
        </div>
        
        {/* Quote text */}
        <div className="quote-container">
          <p className="text-xl font-medium leading-8">
            "{testimonial.quote}"
          </p>
        </div>
        
        {/* Author information - separate container with fixed position */}
        <div className="author-container">
          <div className="author-image">
            <img
              src={testimonial.image}
              alt={testimonial.author}
            />
          </div>
          <div className="author-info">
            <p className="author-name">{testimonial.author}</p>
            <p className="author-role">{testimonial.role}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="testimonials-section">
      <div className="section-container">
        <h2 className="section-title">
          Loved by hoteliers worldwide
        </h2>
        <p className="section-subtitle">
          See how budget hotels across the globe are transforming with Staywise
        </p>
        
        {/* Testimonials slider container */}
        <div className="slider-container">
          {/* Auto-scrolling track */}
          <div className="testimonials-track">
            {/* Original testimonials */}
            {testimonials.map((testimonial, index) => 
              renderTestimonialCard(testimonial, index)
            )}
            
            {/* Duplicate the first few testimonials for seamless looping */}
            {testimonials.slice(0, 3).map((testimonial, index) => 
              renderTestimonialCard(testimonial, index, true)
            )}
          </div>
          
          {/* Gradient overlays for smooth fade at edges */}
          <div className="gradient-overlay left"></div>
          <div className="gradient-overlay right"></div>
        </div>
      </div>
      
      {/* CSS styles with improved structure and fixed heights */}
      <style jsx>{`
        /* Section styling */
        .testimonials-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8rem 4rem;
          width: 100%;
          background-color: var(--muted-30);
          overflow: hidden;
        }
        
        .section-container {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        
        .section-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.15;
          text-align: center;
          letter-spacing: -0.025em;
        }
        
        .section-subtitle {
          margin-top: 1rem;
          margin-bottom: 4rem;
          font-size: 1.5rem;
          font-weight: 500;
          line-height: 1.3;
          text-align: center;
          color: var(--foreground-80);
        }
        
        /* Slider container */
        .slider-container {
          position: relative;
          width: 100%;
          padding: 2rem 0;
        }
        
        /* Testimonial track */
        .testimonials-track {
          display: flex;
          gap: 2rem;
          padding: 1.5rem 0;
          animation: scroll 60s linear infinite;
          width: max-content;
        }
        
        /* Individual testimonial cards */
        .testimonial-card {
          flex: 0 0 auto;
          width: 380px;
          height: 420px; /* Fixed large height */
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: relative;
          padding: 2rem;
          display: grid;
          grid-template-rows: auto 1fr auto; /* 3-row grid: stars, quote, author */
          grid-gap: 1.5rem;
        }
        
        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        /* Stars container */
        .stars-container {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        
        /* Quote container */
        .quote-container {
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
        }
        
        .quote-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        /* Author container - fixed at the bottom */
        .author-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .author-image {
          flex-shrink: 0;
          width: 3.5rem;
          height: 3.5rem;
        }
        
        .author-image img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .author-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .author-name {
          font-weight: 600;
          font-size: 1rem;
        }
        
        .author-role {
          font-size: 0.875rem;
          color: var(--foreground-70);
        }
        
        /* Gradient overlays */
        .gradient-overlay {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100px;
          pointer-events: none;
        }
        
        .gradient-overlay.left {
          left: 0;
          background: linear-gradient(to right, var(--muted-30), transparent);
        }
        
        .gradient-overlay.right {
          right: 0;
          background: linear-gradient(to left, var(--muted-30), transparent);
        }
        
        /* Animation */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-380px * 6 - 2rem * 6));
          }
        }
        
        /* Pause animation on hover */
        .testimonials-track:hover {
          animation-play-state: paused;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .testimonials-section {
            padding: 6rem 1.25rem;
          }
          
          .section-title {
            font-size: 2.5rem;
            line-height: 1.3;
          }
          
          .testimonial-card {
            width: 320px;
            height: 450px; /* Even taller on mobile */
          }
          
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * 6 - 2rem * 6));
            }
          }
        }
      `}</style>
    </section>
  );
};

export default InfiniteTestimonialsScroll; 