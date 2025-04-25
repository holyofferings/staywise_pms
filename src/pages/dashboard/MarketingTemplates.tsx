
import React from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

const MarketingTemplates = () => {
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
            <h1 className="text-2xl font-bold">Marketing Templates</h1>
            <p className="text-white/70">Create and manage marketing materials for your hotel</p>
          </div>
          
          {/* Marketing Templates content will be added here */}
          <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-8 rounded-lg flex items-center justify-center">
            <p className="text-white/50">Marketing Templates functionality will be implemented soon</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketingTemplates;
