"use client";

import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  onClick?: () => void;
}

export default function DashboardCard({ title, value, icon: Icon, description, onClick }: DashboardCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-card border border-border p-6 rounded-sm group transition-all duration-300 shadow-sm ${onClick ? 'cursor-pointer hover:border-gold hover:-translate-y-1' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <h4 className="font-serif text-sm tracking-wider uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </h4>
        <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:scale-110 transition-all duration-500">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <span className="text-2xl font-bold text-foreground tracking-wider">{value}</span>
        {description && (
          <p className="text-[10px] text-muted-foreground font-light mt-1 uppercase tracking-widest">{description}</p>
        )}
      </div>
    </div>
  );
}
