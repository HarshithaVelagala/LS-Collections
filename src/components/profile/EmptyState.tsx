"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="bg-card p-12 border border-border text-center flex flex-col items-center justify-center shadow-sm">
      <div className="h-20 w-20 rounded-full bg-muted border border-border flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="font-serif text-xl text-foreground tracking-wider mb-2">{title}</h3>
      <p className="text-sm font-light text-muted-foreground max-w-sm mb-8">{description}</p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-card border border-primary text-primary hover:bg-section-bg rounded-none tracking-widest text-xs uppercase px-8 h-12 font-bold transition-all"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
