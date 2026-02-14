import { cn } from "@/lib/utils";

import logoImage from "@/assets/WhatsApp Image 2026-02-14 at 1.08.24 PM.jpeg";

interface PlusOneLogoProps {
  className?: string;
  size?: "splash" | "sm" | "md";
  showIcon?: boolean;
}

const sizeClasses = {
  splash: "text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight",
  md: "text-2xl font-semibold tracking-tight",
  sm: "text-lg font-medium tracking-tight",
};

const logoSizes = {
  splash: "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28",
  md: "w-12 h-12",
  sm: "w-8 h-8",
};

/** Logo image from assets – circular, two figures connected */
function LogoIcon({ size = "md", className }: { size?: "splash" | "sm" | "md"; className?: string }) {
  return (
    <img
      src={logoImage}
      alt="Tag along"
      className={cn("rounded-full object-cover object-center shrink-0", logoSizes[size], className)}
    />
  );
}

export function PlusOneLogo({ className, size = "md", showIcon = true }: PlusOneLogoProps) {
  const isInline = size === "sm";
  return (
    <div className={cn(isInline ? "flex flex-row items-center gap-2" : "flex flex-col items-center gap-2", className)}>
      {showIcon && <LogoIcon size={size} />}
      <div className={cn("flex flex-col items-center gap-0", isInline && "items-start")}>
        <span
          className={cn(
            "bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FBBF24] bg-clip-text text-transparent",
            sizeClasses[size],
          )}
        >
          Tag along
        </span>
      </div>
    </div>
  );
}
