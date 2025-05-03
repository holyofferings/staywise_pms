import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  MessageSquare, 
  Zap, 
  FileText, 
  Users, 
  QrCode, 
  Settings, 
  Menu, 
  X,
  ShoppingCart
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  icon, 
  label, 
  isActive,
  collapsed,
  onClick 
}) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/dashboard/bookings", icon: <Calendar size={20} />, label: "Bookings" },
    { to: "/dashboard/rooms", icon: <Bed size={20} />, label: "Rooms" },
    
    { to: "/dashboard/ai-sales-agent", icon: <MessageSquare size={20} />, label: "AI Sales Agent" },
    { to: "/dashboard/ai-automation", icon: <Zap size={20} />, label: "AI Automation" },
    { to: "/dashboard/marketing", icon: <FileText size={20} />, label: "Marketing" },
    { to: "/dashboard/orders", icon: <ShoppingCart size={20} />, label: "WhatsApp Orders" },
    { to: "/dashboard/qr-codes", icon: <QrCode size={20} />, label: "QR Generator" },
    { to: "/dashboard/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Notify parent of initial collapsed state
  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-sidebar backdrop-blur-md text-sidebar-foreground"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen border-r border-sidebar-border transition-all z-40 sidebar",
          collapsed ? "w-[72px]" : "w-[240px]",
          mobileOpen ? "left-0" : "-left-[240px] lg:left-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo and collapse button */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!collapsed ? (
              <Link to="/dashboard" className="flex items-center gap-2">
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 24px; height: 24px; opacity: 0.9"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="currentColor"></rect> </clipPath> </defs> </svg>',
                    }}
                  />
                </div>
                <span className="text-sidebar-foreground font-medium">Staywise</span>
              </Link>
            ) : (
              <div className="collapsed-content w-full flex justify-center">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 24px; height: 24px; opacity: 0.9"> <g clip-path="url(#clip0_1_365)"> <path d="M7.5 3.98399C7.5 5.92599 5.958 7.49999 4.056 7.49999H0.612V3.98399C0.612 2.04299 2.154 0.468994 4.056 0.468994C5.958 0.468994 7.5 2.04299 7.5 3.98399ZM7.5 11.016C7.5 9.07399 9.042 7.49999 10.944 7.49999H14.388V11.016C14.388 12.957 12.846 14.531 10.944 14.531C9.042 14.531 7.5 12.957 7.5 11.016ZM0.612 11.016C0.612 12.957 2.154 14.531 4.056 14.531H7.5V11.016C7.5 9.07399 5.958 7.49999 4.056 7.49999C2.154 7.49999 0.612 9.07399 0.612 11.016ZM14.388 3.98399C14.388 2.04299 12.846 0.468994 10.944 0.468994H7.5V3.98399C7.5 5.92599 9.042 7.49999 10.944 7.49999C12.846 7.49999 14.388 5.92599 14.388 3.98399Z" fill="currentColor"></path> </g> <defs> <clipPath id="clip0_1_365"> <rect width="15" height="15" fill="currentColor"></rect> </clipPath> </defs> </svg>',
                  }}
                />
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
              onClick={toggleSidebar}
            >
              {collapsed ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>',
                  }}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>',
                  }}
                />
              )}
            </Button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.to}>
                  <SidebarLink
                    to={link.to}
                    icon={link.icon}
                    label={link.label}
                    isActive={location.pathname === link.to}
                    collapsed={collapsed}
                    onClick={() => setMobileOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* User profile */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                HD
              </div>
              {!collapsed && (
                <div className="flex-1">
                  <p className="text-sidebar-foreground text-sm font-medium">Hotel Demo</p>
                  <p className="text-sidebar-foreground/60 text-xs">demo@staywise.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
