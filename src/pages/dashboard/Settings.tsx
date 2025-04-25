
import React from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-[240px]">
        {/* Top navigation */}
        <Header />
        
        {/* Page content */}
        <main className="p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-white/70">Manage your account settings and preferences</p>
          </div>
          
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Appearance</CardTitle>
              <CardDescription className="text-white/60">
                Customize how StayWise looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-white/60">
                    {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleTheme}
                  className="border-white/20 hover:bg-white/10 hover:text-white"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Notifications</CardTitle>
              <CardDescription className="text-white/60">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-white/60">
                    Receive email notifications for new bookings
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-white/60">
                    Receive SMS alerts for urgent matters
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
