// Currency formatting utilities for Egyptian Pounds (EGP)

export const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
  const formattedAmount = amount.toLocaleString('en-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  
  return showSymbol ? `${formattedAmount} EGP` : formattedAmount;
};

export const formatCurrencyShort = (amount: number): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M EGP`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K EGP`;
  }
  return `${amount.toLocaleString()} EGP`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
};