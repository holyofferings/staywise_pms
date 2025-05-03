import React, { useState } from "react";
import { StaywiseButton } from "@/components/ui/StaywiseButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const DemoRequestForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    hotelName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Mock API call for form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Success notification
      toast.success("Demo request submitted successfully! We'll be in touch soon.");
      
      // Reset form
      setFormData({
        fullName: "",
        hotelName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/30 border-border text-card-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Request a Demo</CardTitle>
        <CardDescription className="text-foreground/70">
          Fill out the form below and our team will get in touch with you shortly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="bg-background/20 border-input text-foreground placeholder:text-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="hotelName" className="block text-sm mb-1">
              Hotel Name
            </label>
            <Input
              id="hotelName"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              placeholder="Staywise Hotel"
              required
              className="bg-background/20 border-input text-foreground placeholder:text-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="bg-background/20 border-input text-foreground placeholder:text-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm mb-1">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (123) 456-7890"
              required
              className="bg-background/20 border-input text-foreground placeholder:text-foreground/40"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your specific needs..."
              rows={3}
              required
              className="w-full bg-background/20 border border-input rounded-md px-3 py-2 text-foreground placeholder:text-foreground/40 resize-none"
            />
          </div>
          <StaywiseButton
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Demo"}
          </StaywiseButton>
        </form>
      </CardContent>
    </Card>
  );
};
