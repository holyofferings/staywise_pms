import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

const GuestSelfServices: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Guest Self Services</h1>
            <p className="text-muted-foreground">
              Configure and manage self-service options for hotel guests
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Guest Self Services
            </CardTitle>
            <CardDescription>
              This section is currently under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCog className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md">
                The Guest Self Services feature is currently being developed and will be available soon. 
                This feature will allow guests to check-in, check-out, request room service, and more 
                using digital self-service options.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GuestSelfServices; 