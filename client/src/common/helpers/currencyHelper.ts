const formatCurrency = (amount: number): number =>
    Number(amount.toFixed(2)) * 100;

const formatCurrencyToDisplay = (amount: number): number => amount / 100;

const hasDecimals = (amount: string): boolean => parseFloat(amount) % 1 !== 0;

export {formatCurrency, hasDecimals, formatCurrencyToDisplay};
