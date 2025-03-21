
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  titleString?: string; // Optional string title
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  children,
  titleString,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-white/70 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-800/40 shadow-lg hover:shadow-xl transition-all p-5",
        className
      )}
      {...props}
    >
      {titleString && <h3 className="text-lg font-medium mb-4">{titleString}</h3>}
      {children}
    </div>
  );
};
