import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bed, DollarSign, Users } from "lucide-react";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-subtle">Welcome back to your hotel management dashboard</p>
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
          <Card className="card-custom">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Bookings Chart */}
          <Card className="card-custom">
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>
                Booking trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Booking chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activities */}
        <Card className="card-custom">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest updates from your hotel
            </CardDescription>
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
                <div key={index} className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary mr-3"></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-subtle text-sm">{activity.description}</p>
                  </div>
                  <div className="text-muted-foreground text-xs">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
