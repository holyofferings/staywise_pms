import React from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

const MarketingTemplates = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-[240px]">
        {/* Top navigation */}
        <Header />
        
        {/* Page content */}
        <main className="p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Marketing Templates</h1>
            <p className="text-subtle">Create and manage marketing materials for your hotel</p>
          </div>
          
          {/* Marketing Templates content will be added here */}
          <div className="card-custom p-8 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Marketing Templates functionality will be implemented soon</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketingTemplates;
