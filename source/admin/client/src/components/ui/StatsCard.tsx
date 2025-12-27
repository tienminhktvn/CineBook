import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "yellow" | "green" | "blue" | "red";
}

// IMDb-inspired color scheme
const colorClasses = {
  yellow: {
    bg: "bg-[#f5c518]/10",
    icon: "bg-[#f5c518]",
    iconText: "text-black",
  },
  green: {
    bg: "bg-[#3bb33b]/10",
    icon: "bg-[#3bb33b]",
    iconText: "text-white",
  },
  blue: {
    bg: "bg-[#5799ef]/10",
    icon: "bg-[#5799ef]",
    iconText: "text-white",
  },
  red: {
    bg: "bg-[#f54336]/10",
    icon: "bg-[#f54336]",
    iconText: "text-white",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  color = "yellow",
}) => {
  const colors = colorClasses[color];

  return (
    <div
      className={`
        relative overflow-hidden
        ${colors.bg}
        border border-[#333]
        rounded-lg p-5
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#777]">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-sm flex items-center gap-1 ${
                trend.isPositive ? "text-[#3bb33b]" : "text-[#f54336]"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-[#555]">vs last month</span>
            </p>
          )}
        </div>
        <div
          className={`
            w-12 h-12 rounded-lg
            ${colors.icon}
            flex items-center justify-center
          `}
        >
          <Icon className={`w-6 h-6 ${colors.iconText}`} />
        </div>
      </div>
    </div>
  );
};
