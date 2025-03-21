
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

const AnimatedGradient = React.forwardRef<HTMLDivElement, AnimatedGradientProps>(
  ({ className, children, intensity = "medium", ...props }, ref) => {
    const intensityStyles = {
      subtle: "bg-gradient-to-r from-blue-50/40 via-indigo-50/40 to-purple-50/40 dark:from-blue-900/10 dark:via-indigo-900/10 dark:to-purple-900/10",
      medium: "bg-gradient-to-r from-blue-100/60 via-indigo-100/60 to-purple-100/60 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20",
      strong: "bg-gradient-to-r from-blue-200/80 via-indigo-200/80 to-purple-200/80 dark:from-blue-800/30 dark:via-indigo-800/30 dark:to-purple-800/30",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "absolute -z-10 inset-0 overflow-hidden",
          intensityStyles[intensity],
          "animate-gradient-flow bg-[length:200%_200%]",
          className
        )}
        {...props}
      >
        {children}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[100px]" />
      </div>
    );
  }
);

AnimatedGradient.displayName = "AnimatedGradient";

export { AnimatedGradient };
