import * as actiontype from './actions';
import { currencyOptionsValue } from '../constants'
const initialState = {
    totalFundBalance: 0.0,
    activeLoans: 0.0,
    totalLoansGranted: 0.0,
    totalFundBalanceILS: 0.0,
    totalFundBalanceUSD: 0.0,
    totalFundBalanceGBP: 0.0,
    totalFundBalanceEUR: 0.0,
    currencyRates: {
        usdRate: 1.0,
        eurRate: 1.0,
        gbpRate: 1.0
    }
};
const updateBalance = (state, amount, currency) => {
    const updatedState = { ...state };

    // מיפוי של סוגי המטבעות לשדות המתאימים ולשערי החליפין
    const currencyMappings = {
        0: { key: 'totalFundBalanceILS', rate: 1 }, // ILS
        1: { key: 'totalFundBalanceUSD', rate: state.currencyRates.usdRate }, // USD
        2: { key: 'totalFundBalanceEUR', rate: state.currencyRates.eurRate }, // EUR
        3: { key: 'totalFundBalanceGBP', rate: state.currencyRates.gbpRate }, // GBP
    };

    const selectedCurrency = currencyMappings[currency];
    if (selectedCurrency) {
        // חישוב הסכום בשער החליפין
        const adjustedAmount = amount * selectedCurrency.rate;

        // עדכון הסכום במטבע הרלוונטי
        updatedState[selectedCurrency.key] += amount;

        // עדכון הסכום הכללי לפי שער החליפין
        updatedState.totalFundBalance += adjustedAmount;
    }

    return updatedState;
};

const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.SET_CURRENCY_RATES:
            return {
                ...state,
                currencyRates: action.payload // עדכון שערי המטבע
            };
        case actiontype.GET_GLOBAL_VARIABELS: {
            const { totalFundBalance, activeLoans, totalLoansGranted, totalFundBalanceILS, totalFundBalanceUSD, totalFundBalanceGBP, totalFundBalanceEUR } = action.data[0];
            return { ...state, totalFundBalance, activeLoans, totalLoansGranted, totalFundBalanceILS, totalFundBalanceUSD, totalFundBalanceGBP, totalFundBalanceEUR };
        }
        case actiontype.SUB_BALANCE:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance - action.data,
                totalFundBalanceILS: state.totalFundBalanceILS - action.data
            };
        case actiontype.ADD_DEPOSIT: {
            return updateBalance(state, action.data.amount, action.data.currency);
        }
        case actiontype.REPAYMENT_DEPOSIT: {
            return updateBalance(state, -action.data.amount, action.data.currency);
        }
        case actiontype.ADD_DONATION:
            return updateBalance(state, action.data.amount, action.data.currency);
        case actiontype.ADD_LOAN: {
            const updatedState = updateBalance(state, -action.data.amount, action.currency);
            const amountInLocalCurrency = (action.data.currency === 0) ? 1 : state.currencyRates[action.data.currency];
            return {
                ...updatedState, // שמירת העדכונים הקודמים מהפונקציה
                activeLoans: updatedState.activeLoans + action.data.amount*amountInLocalCurrency,
                totalLoansGranted: updatedState.totalLoansGranted + action.data.amount*amountInLocalCurrency
            };
        }
        case actiontype.REPAYMENT_LOAN:
            const amountInLocalCurrency = (action.data.currency === 0) ? 1 : state.currencyRates[action.data.currency];
            return {
                ...state,
                totalFundBalance: state.totalFundBalance + action.data.amount*amountInLocalCurrency,
                activeLoans: state.activeLoans - action.data.amount*amountInLocalCurrency
            };
        default:
            return state;
    }
};

export default globalReducer;
