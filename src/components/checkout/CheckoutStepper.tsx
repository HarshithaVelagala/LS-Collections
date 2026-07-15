"use client";

import { Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { num: 1, label: "SHIPPING" },
    { num: 2, label: "SUMMARY" },
    { num: 3, label: "PAYMENT" },
  ];

  return (
    <div className="flex items-center justify-between w-full relative mb-12">
      {/* Background Line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-border z-0"></div>
      
      {/* Active Line Progress */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-gold z-0 transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      {steps.map((step) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <div key={step.num} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2 sm:px-4">
            <div 
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                isCompleted 
                  ? "bg-gold text-black border-2 border-gold" 
                  : isActive
                    ? "bg-background text-gold border-2 border-gold shadow-[0_0_15px_rgba(200,164,93,0.3)]"
                    : "bg-background text-muted-foreground border-2 border-border"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : step.num}
            </div>
            <span 
              className={`text-[10px] tracking-widest uppercase font-semibold transition-colors duration-300 ${
                isActive || isCompleted ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
