
import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bed, DollarSign, Users } from "lucide-react";

const Dashboard: React.FC = () => {
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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-white/70">Welcome back to your hotel management dashboard</p>
          </div>
          
          {/* Stats overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Total Bookings"
              value="128"
              description="This month"
              trend={{ value: 12, isPositive: true }}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Rooms"
              value="24/30"
              description="Occupied rooms"
              trend={{ value: 4, isPositive: true }}
              icon={<Bed className="h-4 w-4" />}
            />
            <StatsCard
              title="Revenue"
              value="$12,458"
              description="This month"
              trend={{ value: 8, isPositive: true }}
              icon={<DollarSign className="h-4 w-4" />}
            />
            <StatsCard
              title="New Guests"
              value="38"
              description="Last 7 days"
              trend={{ value: 2, isPositive: false }}
              icon={<Users className="h-4 w-4" />}
            />
          </div>
          
          {/* Charts and data visualization */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
              <CardHeader>
                <CardTitle className="text-white">Revenue Overview</CardTitle>
                <CardDescription className="text-white/60">Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-white/50">Revenue chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Bookings Chart */}
            <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
              <CardHeader>
                <CardTitle className="text-white">Booking Analytics</CardTitle>
                <CardDescription className="text-white/60">Booking trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-white/50">Booking chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activities */}
          <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
            <CardHeader>
              <CardTitle className="text-white">Recent Activities</CardTitle>
              <CardDescription className="text-white/60">Latest updates from your hotel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "New Booking",
                    description: "Room 204 booked by John Smith for Aug 15-18",
                    time: "10 minutes ago"
                  },
                  {
                    title: "Check-in Completed",
                    description: "Sarah Johnson checked into Room 112",
                    time: "1 hour ago"
                  },
                  {
                    title: "Room Service Order",
                    description: "Room 301 ordered breakfast via WhatsApp",
                    time: "2 hours ago"
                  },
                  {
                    title: "Check-out Completed",
                    description: "Michael Brown checked out from Room 205",
                    time: "4 hours ago"
                  },
                  {
                    title: "Payment Received",
                    description: "$450 payment received for booking #2389",
                    time: "Yesterday"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start pb-4 border-b border-white/10 last:border-0 last:pb-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-[#512FEB] mr-3"></div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.title}</p>
                      <p className="text-white/70 text-sm">{activity.description}</p>
                    </div>
                    <div className="text-white/50 text-xs">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
