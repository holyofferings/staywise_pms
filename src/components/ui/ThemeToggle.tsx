import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div 
      className={`flex items-center justify-between gap-2 px-1.5 py-1.5 rounded-full cursor-pointer w-[76px] transition-colors duration-300 ${
        isDark ? 'bg-slate-800' : 'bg-slate-200'
      }`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <span 
        className={`flex items-center justify-center h-6 w-6 rounded-full transition-colors duration-300 z-10 ${
          !isDark ? 'text-yellow-600' : 'text-slate-500'
        }`}
      >
        <Sun size={15} />
      </span>
      
      {/* Toggle thumb that slides */}
      <div 
        className={`absolute h-[26px] w-[26px] rounded-full transition-all duration-300 ${
          isDark 
            ? 'translate-x-[42px] bg-indigo-900' 
            : 'translate-x-[1px] bg-white'
        } shadow-md`}
      />
      
      <span 
        className={`flex items-center justify-center h-6 w-6 rounded-full transition-colors duration-300 z-10 ${
          isDark ? 'text-indigo-300' : 'text-slate-500'
        }`}
      >
        <Moon size={15} />
      </span>
    </div>
  );
}; 