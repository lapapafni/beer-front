import React from "react";
import { BeakerIcon } from "@heroicons/react/24/outline";

type Size = "sm" | "md" | "lg";

type Props = {
  size?: Size;
  icon?: React.ElementType;
  className?: string;
};

const SIZE_MAP: Record<Size, { ring: string; icon: string }> = {
  sm: { ring: "w-12 h-12 border-4", icon: "w-4 h-4" },
  md: { ring: "w-16 h-16 border-4", icon: "w-6 h-6" },
  lg: { ring: "w-20 h-20 border-4", icon: "w-8 h-8" },
};

export default function LoadingSpinner({
  size = "lg",
  icon: Icon = BeakerIcon,
  className = "",
}: Props) {
  const { ring, icon } = SIZE_MAP[size];

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${ring} border-amber-500/20 border-t-amber-500 rounded-full animate-spin`}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className={`${icon} text-amber-500 animate-pulse`} />
      </div>
    </div>
  );
}
