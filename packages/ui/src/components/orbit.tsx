"use client";

import { cn } from "../lib/utils";

interface OrbitProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}

export default function Orbit({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}: OrbitProps) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <circle
            className="stroke-black/10 stroke-1 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}

      <div
        style={
          {
            "--duration": duration,
            "--radius": radius,
            "--delay": -delay,
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex h-full w-full transform-gpu items-center justify-center rounded-full",
          {
            "[animation-direction:reverse]": reverse,
          },
          className
        )}
      >
        <div
          className={cn(
            "animate-orbit [animation-delay:calc(var(--delay)*1s)] [animation-duration:calc(var(--duration)*1s)]"
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
