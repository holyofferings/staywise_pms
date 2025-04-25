
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const StaywiseButton: React.FC<ButtonProps> = ({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "flex items-center shadow-[0px_0.707px_0.707px_-0.625px_rgba(0,0,0,0.15),0px_1.807px_1.807px_-1.25px_rgba(0,0,0,0.14),0px_3.622px_3.622px_-1.875px_rgba(0,0,0,0.14),0px_6.866px_6.866px_-2.5px_rgba(0,0,0,0.13),0px_13.647px_13.647px_-3.125px_rgba(0,0,0,0.11),0px_30px_30px_-3.75px_rgba(0,0,0,0.05)] text-white text-[15px] font-normal leading-[18px] px-[15px] py-2.5 rounded-lg",
        variant === "primary"
          ? "bg-[#512FEB] gap-[5px]"
          : "bg-[rgba(255,255,255,0.00)]",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {icon && <div>{icon}</div>}
    </button>
  );
};
