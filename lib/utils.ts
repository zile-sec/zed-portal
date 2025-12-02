import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Generate a random ID similar to uuid v4
export function generateId(): string {
  // Simple implementation that doesn't require uuid package
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomStr}`
}

// Format date to readable string with robust error handling
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Date not available"

  try {
    const d = typeof date === "string" ? new Date(date) : date
    if (isNaN(d.getTime())) return "Invalid date"

    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date error"
  }
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZMW",
  }).format(amount)
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
