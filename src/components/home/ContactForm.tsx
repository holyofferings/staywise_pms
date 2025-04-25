
import React, { useState } from "react";
import { StaywiseButton } from "@/components/ui/StaywiseButton";

export const ContactForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log({ email, message });
    setSubmitted(true);
    setEmail("");
    setMessage("");

    // Reset the submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="flex w-full justify-center items-center px-10 py-[50px]">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <h2 className="text-white text-3xl font-medium leading-tight tracking-[-0.5px] text-center">
          Get in Touch
        </h2>
        <p className="text-[rgba(255,255,255,0.8)] text-base font-normal leading-relaxed text-center mb-4">
          Interested in our services? Send us a message and we'll get back to
          you.
        </p>

        {submitted ? (
          <div className="bg-[rgba(81,47,235,0.2)] text-white p-4 rounded-lg text-center w-full">
            Thank you for your message! We'll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#512FEB]"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-white text-sm">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#512FEB]"
                placeholder="Tell us about your hotel needs..."
              />
            </div>

            <StaywiseButton type="submit" variant="primary" className="w-full">
              Send Message
            </StaywiseButton>
          </form>
        )}
      </div>
    </section>
  );
};
