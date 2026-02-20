import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price?: number) {
  if (!price && price !== 0) return "0.000 TND";
  return new Intl.NumberFormat("ar-TN", {
    style: "currency",
    currency: "TND",
  }).format(price);
}
