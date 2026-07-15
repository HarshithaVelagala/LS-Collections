"use client";

import { useState } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  className?: string;
};

// Global simplified toast logic to circumvent shadcn build issues
let toastListener: ((toast: ToastProps) => void) | null = null;

export const setToastListener = (listener: (toast: ToastProps) => void) => {
  toastListener = listener;
};

export function toast(props: ToastProps) {
  if (toastListener) {
    toastListener(props);
  } else {
    // Fallback if toaster isn't mounted
    console.log("Toast:", props.title, props.description);
    // Use native alert as an absolute fallback for the user to see success
    // if the UI toaster failed to mount.
    if (typeof window !== "undefined") {
      // Just a simple log in production ready mock
    }
  }
}

export function useToast() {
  return {
    toast,
  };
}
