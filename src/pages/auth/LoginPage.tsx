import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StaywiseButton } from "@/components/ui/StaywiseButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { Eye, EyeOff, Github } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 32px; height: 32px; opacity: 0.9"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="white"></rect> </clipPath> </defs> </svg>',
              }}
            />
          </div>
          <span className="text-foreground text-xl font-medium leading-[16.8px]">
            Staywise
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={handleGithubLogin}
                disabled={isLoading}
              >
                <Github size={16} />
                <span>Continue with GitHub</span>
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <StaywiseButton
                  variant="primary"
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </StaywiseButton>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 