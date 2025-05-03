import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [videoError, setVideoError] = useState(false);
  
  // Ensure light theme is applied
  useEffect(() => {
    // Force light theme application
    const root = document.documentElement;
    
    // Clear classes first
    root.classList.remove('dark', 'light');
    
    // Apply light theme
    root.classList.add('light');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock successful signup
      setTimeout(() => {
        localStorage.setItem("staywise-auth", JSON.stringify({ 
          user: email,
          name: fullName,
          hotelName: hotelName
        }));
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast.info("Google signup coming soon");
  };

  return (
    <>
      <Navbar hideAuthButtons={true} />
      <div className="w-screen h-screen overflow-hidden flex pt-16 bg-white">
        {/* Left Section - Signup Form */}
        <div className="w-[60%] h-full p-8 flex justify-center items-center">
          <div className="w-[450px] flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col gap-10">
              <div className="text-center">
                <span className="text-[#0C1421] text-4xl font-semibold font-['SF Pro Rounded']">Create an Account</span>
              </div>
              <div className="text-[#313957] text-xl font-normal leading-8 font-['SF Pro Display']">
                Join Staywise today and transform your hotel operations with AI-powered tools.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-[#0C1421] text-base font-normal font-['Roboto']">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full max-w-[400px] h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#0C1421] text-base font-normal font-['Roboto']">
                  Hotel Name
                </label>
                <Input
                  id="hotelName"
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="Staywise Hotel"
                  required
                  className="w-full max-w-[400px] h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[#0C1421] text-base font-normal font-['Roboto']">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Example@email.com"
                  required
                  className="w-full max-w-[400px] h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-[400px]">
                <div className="flex flex-col gap-2">
                  <label className="text-[#0C1421] text-base font-normal font-['Roboto']">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[#0C1421] text-base font-normal font-['Roboto']">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-1 max-w-[400px]">
                <input 
                  id="terms" 
                  name="terms" 
                  type="checkbox" 
                  className="h-5 w-5 text-[#1E4AE9] focus:ring-[#1E4AE9] border-[#D4D7E3] rounded" 
                  required
                />
                <label htmlFor="terms" className="text-[#313957] text-base font-normal font-['Roboto']">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#1E4AE9] hover:underline font-normal">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#1E4AE9] hover:underline font-normal">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[400px] h-[42px] bg-[#162D3A] text-white text-base rounded-xl py-3 font-normal font-['Roboto'] hover:bg-[#0f1f28] mt-2"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Divider and Social Login */}
            <div className="flex flex-col gap-4 max-w-[400px]">
              <div className="flex items-center w-full">
                <div className="flex-1 h-[1px] bg-[#CFDFE2]"></div>
                <div className="px-4 text-[#294957] text-base font-normal font-['Roboto']">Or</div>
                <div className="flex-1 h-[1px] bg-[#CFDFE2]"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full max-w-[400px] h-[45px] bg-[#F3F9FA] text-[#313957] rounded-xl flex justify-center items-center gap-4 text-base font-normal font-['Roboto'] hover:bg-[#e6f0f2]"
              >
                <div className="w-6 h-6 relative overflow-hidden">
                  <img src="Google__G__logo.svg.png" alt="Google" className="w-full h-full object-cover" />
                </div>
                <span>Sign up with Google</span>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center max-w-[400px] mt-6">
              <span className="text-[#313957] text-lg font-normal font-['Roboto']">Already have an account? </span>
              <Link to="/login" className="text-[#1E4AE9] text-lg font-normal font-['Roboto']">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Video */}
        <div className="w-[40%] h-full relative bg-white p-8 flex justify-center items-center">
          <div className="h-[85%] w-[85%] bg-white rounded-2xl overflow-hidden shadow-lg">
            {!videoError ? (
              <video
                className="w-full h-full object-cover rounded-2xl"
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
              >
                <source src="/freepik__a-smooth-dolly-shot-a-cheerful-hotel-receptionist-__92186.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-[10%] rounded-2xl">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-6">Grow Your Hotel Business</h2>
                  <p className="text-xl text-gray-600">
                    Join hundreds of budget hotels already using Staywise to streamline operations and increase revenue.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage; 