import * as actiontype from './actions';

const initialState = {
    totalFundBalance: 0.0,
    activeLoans: 0.0,
    totalLoansGranted: 0.0
};

const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.GET_GLOBAL_VARIABELS: {
            const { totalFundBalance, activeLoans, totalLoansGranted } = action.data[0];
            return { ...state, totalFundBalance, activeLoans, totalLoansGranted };
        }
        case actiontype.SUB_BALANCE:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance - action.data
            };
        case actiontype.ADD_DEPOSIT:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance + action.data.amount
            };
        case actiontype.REPAYMENT_DEPOSIT:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance - action.amount
            };
        case actiontype.ADD_DONATION:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance + action.data.amount
            };
        case actiontype.ADD_LOAN:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance - action.data.amount,
                activeLoans: state.activeLoans + action.data.amount,
                totalLoansGranted: state.totalLoansGranted + action.data.amount
            };
        case actiontype.REPAYMENT_LOAN:
            return {
                ...state,
                totalFundBalance: state.totalFundBalance + action.data.amount,
                activeLoans: state.activeLoans - action.data.amount
            };
        default:
            return state;
    }
};

export default globalReducer;
