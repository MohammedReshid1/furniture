import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging tailwind classes correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 