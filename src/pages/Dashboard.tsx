import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Bed, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const [bookingPeriod, setBookingPeriod] = useState("monthly");
  const [revenuePeriod, setRevenuePeriod] = useState("monthly");

  // Revenue data for different periods
  const revenueData = {
    weekly: [
      { name: 'Mon', rooms: 2800, services: 1200, other: 800 },
      { name: 'Tue', rooms: 3200, services: 1400, other: 900 },
      { name: 'Wed', rooms: 2900, services: 1300, other: 850 },
      { name: 'Thu', rooms: 3500, services: 1600, other: 1000 },
      { name: 'Fri', rooms: 4200, services: 1800, other: 1200 },
      { name: 'Sat', rooms: 4800, services: 2000, other: 1500 },
      { name: 'Sun', rooms: 3800, services: 1700, other: 1100 },
    ],
    monthly: [
      { name: 'Week 1', rooms: 12000, services: 5000, other: 3000 },
      { name: 'Week 2', rooms: 13500, services: 5500, other: 3500 },
      { name: 'Week 3', rooms: 14200, services: 5800, other: 3800 },
      { name: 'Week 4', rooms: 13800, services: 5600, other: 3600 },
    ],
    yearly: [
      { name: 'Q1', rooms: 45000, services: 18000, other: 12000 },
      { name: 'Q2', rooms: 52000, services: 21000, other: 14000 },
      { name: 'Q3', rooms: 58000, services: 24000, other: 16000 },
      { name: 'Q4', rooms: 55000, services: 22000, other: 15000 },
    ],
  };

  // Revenue category breakdown
  const revenueBreakdown = {
    weekly: {
      rooms: { value: 25400, trend: 12 },
      services: { value: 11000, trend: 8 },
      other: { value: 7350, trend: 5 },
    },
    monthly: {
      rooms: { value: 53500, trend: 15 },
      services: { value: 21900, trend: 10 },
      other: { value: 13900, trend: 7 },
    },
    yearly: {
      rooms: { value: 210000, trend: 18 },
      services: { value: 85000, trend: 12 },
      other: { value: 57000, trend: 9 },
    },
  };

  // Sample data for booking distribution - Weekly
  const weeklyBookingData = [
    { name: 'Mon', standard: 12, deluxe: 8, suite: 5 },
    { name: 'Tue', standard: 15, deluxe: 10, suite: 7 },
    { name: 'Wed', standard: 10, deluxe: 6, suite: 4 },
    { name: 'Thu', standard: 14, deluxe: 9, suite: 6 },
    { name: 'Fri', standard: 18, deluxe: 12, suite: 8 },
    { name: 'Sat', standard: 20, deluxe: 15, suite: 10 },
    { name: 'Sun', standard: 16, deluxe: 11, suite: 7 },
  ];

  // Sample data for booking distribution - Monthly
  const monthlyBookingData = [
    { name: 'Week 1', standard: 45, deluxe: 30, suite: 20 },
    { name: 'Week 2', standard: 50, deluxe: 35, suite: 25 },
    { name: 'Week 3', standard: 55, deluxe: 40, suite: 30 },
    { name: 'Week 4', standard: 60, deluxe: 45, suite: 35 },
  ];

  // Sample data for booking distribution - Yearly
  const yearlyBookingData = [
    { name: 'Q1', standard: 180, deluxe: 120, suite: 80 },
    { name: 'Q2', standard: 220, deluxe: 150, suite: 100 },
    { name: 'Q3', standard: 250, deluxe: 180, suite: 120 },
    { name: 'Q4', standard: 200, deluxe: 140, suite: 90 },
  ];

  // Room type occupancy data
  const roomTypeData = {
    weekly: [
      { name: 'Mon', standard: 85, deluxe: 70, suite: 60 },
      { name: 'Tue', standard: 88, deluxe: 75, suite: 65 },
      { name: 'Wed', standard: 82, deluxe: 68, suite: 58 },
      { name: 'Thu', standard: 90, deluxe: 78, suite: 70 },
      { name: 'Fri', standard: 95, deluxe: 85, suite: 80 },
      { name: 'Sat', standard: 98, deluxe: 92, suite: 88 },
      { name: 'Sun', standard: 92, deluxe: 80, suite: 75 },
    ],
    monthly: [
      { name: 'Week 1', standard: 87, deluxe: 75, suite: 65 },
      { name: 'Week 2', standard: 90, deluxe: 80, suite: 70 },
      { name: 'Week 3', standard: 92, deluxe: 85, suite: 75 },
      { name: 'Week 4', standard: 95, deluxe: 88, suite: 80 },
    ],
    yearly: [
      { name: 'Q1', standard: 88, deluxe: 78, suite: 68 },
      { name: 'Q2', standard: 92, deluxe: 82, suite: 72 },
      { name: 'Q3', standard: 95, deluxe: 85, suite: 75 },
      { name: 'Q4', standard: 90, deluxe: 80, suite: 70 },
    ],
  };

  // Booking sources data
  const sourcesData = {
    weekly: [
      { name: 'Direct', value: 65 },
      { name: 'Booking.com', value: 15 },
      { name: 'Expedia', value: 10 },
      { name: 'Airbnb', value: 5 },
      { name: 'Others', value: 5 },
    ],
    monthly: [
      { name: 'Direct', value: 45 },
      { name: 'Booking.com', value: 25 },
      { name: 'Expedia', value: 15 },
      { name: 'Airbnb', value: 10 },
      { name: 'Others', value: 5 },
    ],
    yearly: [
      { name: 'Direct', value: 55 },
      { name: 'Booking.com', value: 20 },
      { name: 'Expedia', value: 12 },
      { name: 'Airbnb', value: 8 },
      { name: 'Others', value: 5 },
    ],
  };

  // Source trends data
  const sourceTrendsData = {
    weekly: [
      { name: 'Mon', direct: 65, booking: 15, expedia: 10, airbnb: 5, others: 5 },
      { name: 'Tue', direct: 68, booking: 14, expedia: 9, airbnb: 5, others: 4 },
      { name: 'Wed', direct: 62, booking: 16, expedia: 11, airbnb: 6, others: 5 },
      { name: 'Thu', direct: 70, booking: 13, expedia: 8, airbnb: 5, others: 4 },
      { name: 'Fri', direct: 75, booking: 12, expedia: 7, airbnb: 4, others: 2 },
      { name: 'Sat', direct: 80, booking: 10, expedia: 6, airbnb: 3, others: 1 },
      { name: 'Sun', direct: 72, booking: 13, expedia: 8, airbnb: 4, others: 3 },
    ],
    monthly: [
      { name: 'Week 1', direct: 45, booking: 25, expedia: 15, airbnb: 10, others: 5 },
      { name: 'Week 2', direct: 48, booking: 23, expedia: 14, airbnb: 9, others: 6 },
      { name: 'Week 3', direct: 50, booking: 22, expedia: 13, airbnb: 8, others: 7 },
      { name: 'Week 4', direct: 52, booking: 20, expedia: 12, airbnb: 9, others: 7 },
    ],
    yearly: [
      { name: 'Q1', direct: 55, booking: 20, expedia: 12, airbnb: 8, others: 5 },
      { name: 'Q2', direct: 58, booking: 19, expedia: 11, airbnb: 7, others: 5 },
      { name: 'Q3', direct: 60, booking: 18, expedia: 10, airbnb: 7, others: 5 },
      { name: 'Q4', direct: 57, booking: 19, expedia: 11, airbnb: 8, others: 5 },
    ],
  };

  // Get the appropriate data based on selected period
  const getBookingData = () => {
    switch (bookingPeriod) {
      case 'weekly':
        return weeklyBookingData;
      case 'monthly':
        return monthlyBookingData;
      case 'yearly':
        return yearlyBookingData;
      default:
        return monthlyBookingData;
    }
  };

  // Get the appropriate stats based on selected period
  const getBookingStats = () => {
    switch (bookingPeriod) {
      case 'weekly':
        return {
          direct: { value: 65, trend: true },
          ota: { value: 35, trend: false },
          standard: 111,
          deluxe: 83,
          suite: 47
        };
      case 'monthly':
        return {
          direct: { value: 45, trend: true },
          ota: { value: 55, trend: false },
          standard: 210,
          deluxe: 150,
          suite: 110
        };
      case 'yearly':
        return {
          direct: { value: 55, trend: true },
          ota: { value: 45, trend: false },
          standard: 850,
          deluxe: 590,
          suite: 390
        };
      default:
        return {
          direct: { value: 45, trend: true },
          ota: { value: 55, trend: false },
          standard: 210,
          deluxe: 150,
          suite: 110
        };
    }
  };

  // Get revenue data based on selected period
  const getRevenueData = () => {
    return revenueData[revenuePeriod as keyof typeof revenueData];
  };

  // Get revenue breakdown based on selected period
  const getRevenueBreakdown = () => {
    return revenueBreakdown[revenuePeriod as keyof typeof revenueBreakdown];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
              <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue breakdown by category</CardDescription>
              </div>
              <Select 
                defaultValue="monthly" 
                onValueChange={(value) => setRevenuePeriod(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Room Revenue</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">₹{getRevenueBreakdown().rooms.value.toLocaleString()}</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+{getRevenueBreakdown().rooms.trend}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Service Revenue</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">₹{getRevenueBreakdown().services.value.toLocaleString()}</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+{getRevenueBreakdown().services.trend}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Other Revenue</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">₹{getRevenueBreakdown().other.value.toLocaleString()}</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">+{getRevenueBreakdown().other.trend}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getRevenueData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="rooms" stackId="1" stroke="#0088FE" fill="#0088FE" name="Rooms" />
                        <Area type="monotone" dataKey="services" stackId="1" stroke="#00C49F" fill="#00C49F" name="Services" />
                        <Area type="monotone" dataKey="other" stackId="1" stroke="#FFBB28" fill="#FFBB28" name="Other" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="rooms" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getRevenueData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="rooms" stroke="#0088FE" name="Room Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="services" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getRevenueData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="services" stroke="#00C49F" name="Service Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="other" className="space-y-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getRevenueData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="other" stroke="#FFBB28" name="Other Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
              </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Bookings Chart */}
          <Card className="card-custom">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
              <CardTitle>Booking Analytics</CardTitle>
                <CardDescription>Booking trends and distribution</CardDescription>
              </div>
              <Select 
                defaultValue="monthly" 
                onValueChange={(value) => setBookingPeriod(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="room-types">Room Types</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Direct Bookings</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{getBookingStats().direct.value}%</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">OTA Bookings</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{getBookingStats().ota.value}%</span>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Standard Rooms</span>
                      </div>
                      <span className="text-sm font-medium">{getBookingStats().standard} bookings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Deluxe Rooms</span>
                      </div>
                      <span className="text-sm font-medium">{getBookingStats().deluxe} bookings</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Suites</span>
                      </div>
                      <span className="text-sm font-medium">{getBookingStats().suite} bookings</span>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getBookingData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="standard" stackId="a" fill="#0088FE" />
                        <Bar dataKey="deluxe" stackId="a" fill="#00C49F" />
                        <Bar dataKey="suite" stackId="a" fill="#FFBB28" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                {/* Room Types Tab Content */}
                <TabsContent value="room-types" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Standard Rooms</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{getBookingStats().standard}</span>
                        <span className="text-sm text-muted-foreground">bookings</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Deluxe Rooms</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{getBookingStats().deluxe}</span>
                        <span className="text-sm text-muted-foreground">bookings</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Suites</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{getBookingStats().suite}</span>
                        <span className="text-sm text-muted-foreground">bookings</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={roomTypeData[bookingPeriod as keyof typeof roomTypeData]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="standard" stroke="#0088FE" name="Standard" />
                        <Line type="monotone" dataKey="deluxe" stroke="#00C49F" name="Deluxe" />
                        <Line type="monotone" dataKey="suite" stroke="#FFBB28" name="Suite" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                {/* Sources Tab Content */}
                <TabsContent value="sources" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourcesData[bookingPeriod as keyof typeof sourcesData]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {sourcesData[bookingPeriod as keyof typeof sourcesData].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={sourceTrendsData[bookingPeriod as keyof typeof sourceTrendsData]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="direct" stackId="1" stroke="#0088FE" fill="#0088FE" />
                          <Area type="monotone" dataKey="booking" stackId="1" stroke="#00C49F" fill="#00C49F" />
                          <Area type="monotone" dataKey="expedia" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                          <Area type="monotone" dataKey="airbnb" stackId="1" stroke="#FF8042" fill="#FF8042" />
                          <Area type="monotone" dataKey="others" stackId="1" stroke="#8884D8" fill="#8884D8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
              </div>
                </TabsContent>
              </Tabs>
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
