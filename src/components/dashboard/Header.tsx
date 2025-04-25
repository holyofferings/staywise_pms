
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  HelpCircle 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
    }
  };
  
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("staywise-auth");
    
    // Notification
    toast.success("Logged out successfully");
    
    // Redirect to landing page
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-md">
      {/* Left side - Search */}
      <div className="hidden sm:block lg:w-[320px]">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full h-10 rounded-md bg-white/5 border-white/10 pl-10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#512FEB]/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      
      <div className="sm:hidden">
        {/* Nothing here in mobile view - sidebar toggle is in Sidebar component */}
      </div>

      {/* Right side - User actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
          <Bell size={20} />
        </Button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <div className="h-10 w-10 rounded-full bg-[#512FEB] flex items-center justify-center text-white">
                HD
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Hotel Demo</p>
                <p className="text-xs text-muted-foreground">demo@staywise.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open("#support", "_blank")}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
