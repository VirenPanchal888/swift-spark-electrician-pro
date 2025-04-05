
/**
 * Formats a number as Indian Rupees (₹)
 */
export const formatRupees = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a number as Indian Rupees (₹) without decimal points
 * Useful for whole number amounts
 */
export const formatRupeesWhole = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Parses a string with Indian Rupee format back to a number
 */
export const parseRupees = (value: string): number => {
  // Remove the rupee symbol, commas, and any whitespace
  const cleanValue = value.replace(/[₹,\s]/g, '');
  return parseFloat(cleanValue);
};
