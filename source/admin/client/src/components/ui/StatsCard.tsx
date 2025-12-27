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
  color?: "indigo" | "emerald" | "amber" | "rose";
}

const colorClasses = {
  indigo: {
    bg: "from-indigo-500/10 to-purple-500/10",
    icon: "from-indigo-500 to-purple-500",
    text: "text-indigo-400",
  },
  emerald: {
    bg: "from-emerald-500/10 to-teal-500/10",
    icon: "from-emerald-500 to-teal-500",
    text: "text-emerald-400",
  },
  amber: {
    bg: "from-amber-500/10 to-orange-500/10",
    icon: "from-amber-500 to-orange-500",
    text: "text-amber-400",
  },
  rose: {
    bg: "from-rose-500/10 to-pink-500/10",
    icon: "from-rose-500 to-pink-500",
    text: "text-rose-400",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  color = "indigo",
}) => {
  const colors = colorClasses[color];

  return (
    <div
      className={`
        relative overflow-hidden
        bg-linear-to-br ${colors.bg}
        border border-slate-700/50
        rounded-2xl p-6
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-sm flex items-center gap-1 ${
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-slate-400">vs last month</span>
            </p>
          )}
        </div>
        <div
          className={`
            w-12 h-12 rounded-xl
            bg-linear-to-br ${colors.icon}
            flex items-center justify-center
            shadow-lg
          `}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
