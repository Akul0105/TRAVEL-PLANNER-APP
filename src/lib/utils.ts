/**
 * Utility functions for the Travel Agent Planner application
 * This file contains helper functions used throughout the application
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID for components
 * @returns A unique string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Format currency for display
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format date for display
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Debounce function to limit API calls
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Simulate market basket analysis recommendations
 * This simulates what a trained model would do for travel recommendations
 * @param currentPackage - The current travel package
 * @param allPackages - All available packages
 * @returns Array of recommended package IDs
 */
export function getMarketBasketRecommendations(
  currentPackage: string,
  allPackages: { id: string }[]
): string[] {
  // Simulate market basket analysis logic
  // In a real implementation, this would use a trained ML model
  const recommendations = allPackages
    .filter(pkg => pkg.id !== currentPackage)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(pkg => pkg.id);
  
  return recommendations;
}
