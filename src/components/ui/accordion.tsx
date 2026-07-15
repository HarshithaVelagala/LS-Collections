"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionContextType {
  openValues: string[];
  toggleValue: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  className?: string;
  children: React.ReactNode;
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  className,
  children,
}: AccordionProps) {
  const [openValues, setOpenValues] = useState<string[]>(() => {
    if (Array.isArray(defaultValue)) {
      return defaultValue;
    } else if (defaultValue) {
      return [defaultValue];
    }
    return [];
  });

  const toggleValue = useCallback((value: string) => {
    setOpenValues((prev) => {
      const isAlreadyOpen = prev.includes(value);

      if (type === "single") {
        if (isAlreadyOpen) {
          return collapsible ? [] : prev;
        }
        return [value];
      } else {
        if (isAlreadyOpen) {
          return prev.filter((v) => v !== value);
        }
        return [...prev, value];
      }
    });
  }, [type, collapsible]);

  const contextValue = useMemo(() => ({ openValues, toggleValue }), [openValues, toggleValue]);

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn("space-y-1", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={cn("border-b border-purple-royal/10", className)}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionTrigger({ className, children }: AccordionTriggerProps) {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionTrigger must be used within Accordion and AccordionItem");
  }

  const { openValues, toggleValue } = accordionContext;
  const { value } = itemContext;
  const isOpen = openValues.includes(value);

  return (
    <button
      type="button"
      onClick={() => toggleValue(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left font-serif text-sm tracking-wider uppercase font-semibold text-white hover:text-gold transition-colors duration-200 focus:outline-none",
        className
      )}
    >
      <span>{children}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="text-zinc-500 hover:text-gold"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </button>
  );
}

interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function AccordionContent({ className, children }: AccordionContentProps) {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionContent must be used within Accordion and AccordionItem");
  }

  const { openValues } = accordionContext;
  const { value } = itemContext;
  const isOpen = openValues.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className={cn("pb-4 pt-1 font-sans text-sm text-zinc-300 font-light", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
