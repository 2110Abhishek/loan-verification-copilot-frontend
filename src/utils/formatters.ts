export type CurrencyType = 'USD' | 'INR';

export const TODAY_USD_TO_INR_RATE = 87.0;

export function getCurrencySymbol(currency: CurrencyType = 'INR'): string {
  return '₹';
}

export function convertAmount(amount: number, currency: CurrencyType = 'INR'): number {
  return amount * TODAY_USD_TO_INR_RATE;
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: CurrencyType = 'INR'
): string {
  if (amount === null || amount === undefined || amount === '') return 'N/A';
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);

  const inrValue = num * TODAY_USD_TO_INR_RATE;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(inrValue);
}
