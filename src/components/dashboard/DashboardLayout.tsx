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
    <div className={`dashboard-layout min-h-screen bg-background text-foreground ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Sidebar */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main content area */}
      <div className="dashboard-content min-h-screen">
        {/* Top navigation */}
        <Header />
        
        {/* Page content - added max-w-screen-xl and mx-auto to constrain width */}
        <main className="p-4 sm:p-6 max-w-screen-xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}; 