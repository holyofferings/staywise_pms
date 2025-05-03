import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [videoError, setVideoError] = useState(false);
  
  // Ensure light theme is applied when component mounts
  useEffect(() => {
    // Force light theme application
    const root = document.documentElement;
    
    // Clear classes first
    root.classList.remove('dark', 'light');
    
    // Apply light theme
    root.classList.add('light');
    
    console.log("LoginPage mounting with light theme");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Mock successful login
      setTimeout(() => {
        localStorage.setItem("staywise-auth", JSON.stringify({ user: email }));
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google login coming soon");
  };

  const handleFacebookLogin = () => {
    toast.info("Facebook login coming soon");
  };
  
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <Navbar hideAuthButtons={true} onLogoClick={handleLogoClick} />
      <div className="w-screen h-screen overflow-hidden flex pt-16 bg-white">
        {/* Left Section - Login Form */}
        <div className="w-[60%] h-full p-8 flex justify-center items-center">
          <div className="w-[450px] flex flex-col gap-1">
            {/* Header */}
            <div className="flex flex-col gap-5 max-w-[400px]">
              <div className="text-center">
                <span className="text-[#0C1421] text-4xl font-semibold font-['SF Pro Rounded']">Welcome Back </span>
                <span className="text-[#0C1421] text-4xl font-normal font-['SF Pro Rounded']">👋</span>
              </div>
              <div className="flex flex-col gap text-[#313957] text-l font-normal leading-8 font-['SF Pro Display']">
                Today is a new day. It's your day. You shape it.<br/>
                Sign in to start managing your projects.
              </div>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-5">
              <div className="flex flex-col gap-4">
                <label className="text-[#0C1421] text-base font-normal">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Example@email.com"
                  required
                  className="w-full max-w-[350px] h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#0C1421] text-base font-normal">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full max-w-[350px] h-10 bg-[#F7FBFF] border-[#D4D7E3] border rounded-xl text-base placeholder:text-[#8897AD]"
                />
              </div>

              <div className="text-right max-w-[350px]">
                <Link to="/forgot-password" className="text-[#1E4AE9] text-base font-normal">
                  Forgot Password?
                </Link>
                <div className="flex flex-col gap-5"></div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[350px] h-[38px] bg-[#162D3A] text-white text-base rounded-xl py-3 font-normal hover:bg-[#0f1f28]"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Divider and Social Logins */}
            <div className="flex flex-col gap-4 max-w-[350px]">
              <div className="flex items-center w-full">
                <div className="flex-1 h-[1px] bg-[#CFDFE2]"></div>
                <div className="px-4 text-[#294957] text-base font-normal">Or</div>
                <div className="flex-1 h-[1px] bg-[#CFDFE2]"></div>
              </div>

              <div className="flex flex-col gap-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full max-w-[350px] h-[45px] bg-[#F3F9FA] text-[#313957] rounded-xl flex justify-center items-center gap-4 text-base font-normal hover:bg-[#e6f0f2]"
                >
                  <div className="w-6 h-6 relative overflow-hidden">
                    <img src="Google__G__logo.svg.png" alt="Google" className="w-6 h-6" />
                  </div>
                  <span>Sign in with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full max-w-[350px] h-[45px] bg-[#F3F9FA] text-[#313957] rounded-xl flex justify-center items-center gap-4 text-base font-normal hover:bg-[#e6f0f2]"
                >
                  <div className="w-6 h-6 relative overflow-hidden">
                    <img src="hd-blue-and-white-square-facebook-fb-logo-70175169479235560lh86s7jg.png" alt="Facebook" className="w-10 h-6" />
                  </div>
                  <span>Sign in with Facebook</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center max-w-[350px] mt-6">
              <span className="text-[#313957] text-lg font-normal">Don't you have an account? </span>
              <Link to="/signup" className="text-[#1E4AE9] text-lg font-normal">
                Sign up
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
                  <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Staywise</h2>
                  <p className="text-xl text-gray-600">
                    AI-powered hotel management for budget hotels. Simplify operations and boost guest experience.
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

export default LoginPage; 