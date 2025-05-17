import React, { useState, ReactNode, useEffect } from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Ensure light theme is applied
  useEffect(() => {
    // Force light theme application
    const root = document.documentElement;
    
    // Clear classes first
    root.classList.remove('dark', 'light');
    
    // Apply light theme
    root.classList.add('light');
  }, []);

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className={`dashboard-layout flex h-screen bg-background text-foreground ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Sidebar */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main content area */}
      <div className="dashboard-content flex flex-col flex-1 h-screen overflow-hidden">
        {/* Top navigation */}
        <Header />
        
        {/* Page content - removed width constraints and made it fill available space */}
        <main className="p-4 sm:p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}; 