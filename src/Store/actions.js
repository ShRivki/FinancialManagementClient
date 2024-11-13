export const LOG_OUT = "LOG_OUT";
export const LOG_IN = "LOG_IN";

export const GET_USERS = "GET_USERS";
export const ADD_USER = "ADD_USER";
//export const DELETE_USER = "DELETE_USER";
export const EDIT_USER = "EDIT_USER";

export const ADD_LOAN="ADD_LOAN"
export const REPAYMENT_LOAN="REPAYMENT_LOAN"
export const GET_LOANS="GET_LOANS"
export const EDIT_LOAN="EDIT_LOAN"
export const GET_INACTIVE_LOANS="GET_INACTIVE_LOANS"


export const ADD_DONATION="ADD_DONATION"
export const GET_DONATIONS="GET_DONATIONS"

export const ADD_DEPOSIT="ADD_DEPOSIT"
export const REPAYMENT_DEPOSIT="REPAYMENT_DEPOSIT"
export const GET_DEPOSITS="GET_DEPOSITS"
export const GET_INACTIVE_DEPOSITS="GET_INACTIVE_DEPOSITS"

export const GET_GUARANTEES="GET_GUARANTEES"

export const LOAN_IN_EFFECT="LOAN_IN_EFFECT"
export const GET_MONEY_LEFT="GET_MONEY_LEFT"
export const ALL_THE_LOANS_THAT_WARE="ALL_THE_LOANS_THAT_WARE"

export const GET_GLOBAL_VARIABELS="GET_GLOBAL_VARIABELS"
export const SUB_BALANCE="SUB_BALANCE"
export const LOADING_START = 'LOADING_START';
export const LOADING_END = 'LOADING_END';

export const SET_CURRENCY_RATES = 'SET_CURRENCY_RATES';
export const setCurrencyRates = (rates) => ({
    type: SET_CURRENCY_RATES,
    payload: rates
});
export const startLoading = () => ({
    type: LOADING_START
});

export const endLoading = () => ({
    type: LOADING_END
});