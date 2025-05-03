import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings as SettingsIcon, LogOut, Save } from "lucide-react";

interface HotelSettings {
  hotelName: string;
  adminEmail: string;
  whatsappNumber: string;
  logo: string;
  primaryColor: string;
  notifications: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<HotelSettings>({
    hotelName: "Staywise Hotel",
    adminEmail: "admin@staywise.com",
    whatsappNumber: "+1234567890",
    logo: "",
    primaryColor: "#512FEB",
    notifications: {
      email: true,
      whatsapp: true,
      sms: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message or handle errors
    }, 1000);
  };

  const handleLogout = () => {
    // Implement logout logic
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/70">Manage your hotel preferences and account settings</p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-[#512FEB] hover:bg-[#512FEB]/90"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Hotel Information</CardTitle>
              <CardDescription className="text-white/60">Update your hotel's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input
                  id="hotel-name"
                  value={settings.hotelName}
                  onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp-number">WhatsApp Number</Label>
                <Input
                  id="whatsapp-number"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Hotel Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-white/60">Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-white/70">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, email: checked },
                    })
                  }
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-notifications">WhatsApp Notifications</Label>
                  <p className="text-sm text-white/70">Receive notifications via WhatsApp</p>
                </div>
                <Switch
                  id="whatsapp-notifications"
                  checked={settings.notifications.whatsapp}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, whatsapp: checked },
                    })
                  }
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-white/70">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.notifications.sms}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, sms: checked },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-white/60">Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-white/70">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked },
                    })
                  }
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="grid gap-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: Number(e.target.value),
                      },
                    })
                  }
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Appearance</CardTitle>
              <CardDescription className="text-white/60">Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="bg-[#1A1A1A] border-white/10"
                  />
                  <div
                    className="w-10 h-10 rounded-md border border-white/10"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
