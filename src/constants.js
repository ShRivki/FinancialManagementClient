
export const currencyOptions = [
    { label: '₪', value: 0 },
    { label: '$', value: 1 },
    { label: '€', value: 2 },
    { label: '£', value: 3 },
];
export const fundraiserOptions = [
    { label: 'אליהו שרייבר', value: 0 },
    { label: 'יעקב פרידמן', value: 1 },
    { label: 'אליהו גורפיין', value: 2 },
    { label: 'כללי', value: 3 }
];
export const currencyOptionsValue = {
    0: '₪',
    1: '$',
    2: '€',
    3: '£'
};
export const fundraiserOptionsValue = {
    0: 'אליהו שרייבר',
    1: 'יעקב פרידמן',
    2: 'אליהו גורפיין',
    3: 'כללי',
};
export const paymentMethodsOptions = [
    { id: 0, name: 'אחר' },
    { id: 1, name: 'צ"ק' },
    { id: 2, name: 'מזומן' },
    { id: 4, name: 'העברה' }
];
export const paymentMethodsOptionsValue = {
    0: 'אחר',
    1: 'צ"ק',
    2: 'מזומן',
    4: 'העברה'
}

export const moneyRecipientOptions = [
    { id: 0, name: 'אליהו שרייבר' },
    { id: 1, name: 'יעקב פרידמן' }
];

export const moneyRecipientOptionsValue = {
    0: 'אליהו שרייבר',
    1: 'יעקב פרידמן'
};
export const formatCurrency = (amount) => {
    // אם הסכום שלם, הצג את הסכום עם פסיקים בלבד
    return amount % 1 === 0
        ? amount.toLocaleString('he-IL')
        // אם יש חלק עשרוני, הצג אותו עם שתי ספרות עשרוניות
        : amount.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
export const convertToILS = (amount, currency,currencyRates) => {
    // alert(currency)
    const currencyMappings = {
        0: 1, // ILS
        1: currencyRates.usdRate, // USD
        2: currencyRates.eurRate, // EUR
        3: currencyRates.gbpRate // GBP
    };
    const rate = currencyMappings[currency];
    if (rate) {
        return amount * rate; // המרת הסכום לשקלים
    } else {
        throw new Error("Invalid currency type");
    }
};



export const BASIC_URL = 'https://localhost:7030/api'