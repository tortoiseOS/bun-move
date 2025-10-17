"use client";

import React, { type CSSProperties } from "react";

import { cn } from "../lib/utils";

export interface ShinyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
}

const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ className, shimmerColor = "#ffffff", children, ...props }, ref) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
          } as CSSProperties
        }
        className={cn(
          "group relative overflow-hidden rounded-lg px-6 py-2 transition-all duration-300 hover:scale-105",
          "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500",
          "text-white shadow-lg hover:shadow-xl",
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-1000 hover:before:translate-x-full",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

ShinyButton.displayName = "ShinyButton";

export default ShinyButton;
