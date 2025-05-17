import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, UserPlus, CalendarDays, Users, ClipboardList, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FrontOffice: React.FC = () => {
  const modules = [
    {
      title: "Reservation",
      description: "Manage new bookings and reservations",
      icon: <Calendar className="h-8 w-8 text-primary" />,
      href: "/dashboard/front-office/reservation",
    },
    {
      title: "Walk In",
      description: "Handle walk-in guests and immediate bookings",
      icon: <UserPlus className="h-8 w-8 text-primary" />,
      href: "/dashboard/front-office/walk-in",
    },
    {
      title: "Today's Events",
      description: "View today's check-ins, check-outs and events",
      icon: <CalendarDays className="h-8 w-8 text-primary" />,
      href: "/dashboard/front-office/events",
    },
    {
      title: "Guest Self Services",
      description: "Configure and manage self-service options",
      icon: <UserCog className="h-8 w-8 text-primary" />,
      href: "/dashboard/front-office/guest-services",
    },
    {
      title: "Guest Profiles",
      description: "View and manage guest information",
      icon: <Users className="h-8 w-8 text-primary" />,
      href: "/dashboard/front-office/guest-profiles",
    },
    {
      title: "Reservation List",
      description: "View all current and upcoming reservations",
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
      href: "/dashboard/front-office/reservation-list",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Front Office</h1>
            <p className="text-muted-foreground">
              Manage all front desk operations and guest services
            </p>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => (
            <Link to={module.href} key={index}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="mb-2">{module.icon}</div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-start">
                    Open {module.title}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FrontOffice; 