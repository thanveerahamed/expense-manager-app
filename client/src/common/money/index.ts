export enum CURRENCY {
    EUR = 'EUR',
}

export const CURRENCY_MAP: Record<string, string> = {
    [CURRENCY.EUR]: '€',
};

export const formatAmountWithCurrency = (currency: string, amount: string) => {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency,
    }).format(Number(amount));
};
