/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the provided function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

/**
 * Formats a price with the specified currency symbol
 * 
 * @param price The price to format
 * @param currencySymbol The currency symbol to use (default: ₹)
 * @returns Formatted price string
 */
export function formatPrice(price: number | undefined | null, currencySymbol: string = '₹'): string {
  // Handle undefined or null price values
  if (price === undefined || price === null) {
    console.warn('Attempted to format undefined or null price');
    return `${currencySymbol}0`;
  }
  
  // Handle NaN values
  if (isNaN(price)) {
    console.warn('Attempted to format NaN price value');
    return `${currencySymbol}0`;
  }
  
  // Format the price normally - round to nearest whole number
  return `${currencySymbol}${Math.round(price)}`;
}

/**
 * Calculates the discounted price
 * 
 * @param price The original price
 * @param discountPercentage The discount percentage
 * @returns The discounted price
 */
export function calculateDiscountedPrice(price: number | undefined | null, discountPercentage: number | undefined | null): number {
  // Handle invalid price values
  if (price === undefined || price === null || isNaN(price)) {
    console.warn('Attempted to calculate discount with invalid price:', price);
    return 0;
  }
  
  // Handle invalid discount percentage
  if (discountPercentage === undefined || discountPercentage === null || isNaN(discountPercentage)) {
    console.warn('Invalid discount percentage, returning original price');
    return price;
  }
  
  // If discount is zero, return original price
  if (discountPercentage === 0) return price;
  
  // Calculate discounted price
  return price - (price * discountPercentage / 100);
}

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * 
 * @param text The text to truncate
 * @param maxLength The maximum length of the text
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Formats a date string to a more readable format
 * 
 * @param dateString The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date string to a relative time (e.g., "2 hours ago")
 * 
 * @param dateString The date string to format
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}