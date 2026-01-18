import { type ClassValue, clsx } from "clsx";

// Generate UUID v4
export function generateId(): string {
  return crypto.randomUUID();
}

// Get current ISO timestamp
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format date for input field (YYYY-MM-DD)
export function formatDateForInput(dateString: string): string {
  return dateString.split('T')[0];
}

// Utility for merging CSS classes (useful with Tailwind)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
