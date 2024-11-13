import * as actiontype from './actions';

const initialState = {
    loans: [],
    inactiveLoans: []

};

const loansReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.GET_LOANS:
            return { ...state, loans: action.data };
        case actiontype.GET_INACTIVE_LOANS:
            return { ...state, inactiveLoans: action.data };
        case actiontype.ADD_LOAN:
            return { ...state, loans: [...state.loans, action.data] };

        case actiontype.REPAYMENT_LOAN:
            const repaymentLoans = [...state.loans];
            const repaymentIndex = repaymentLoans.findIndex(x => x.id === action.data.id);
            if (repaymentIndex !== -1) {
                repaymentLoans[repaymentIndex] = action.data;
                return { ...state, loans: repaymentLoans };
            } else {
                console.log(state.loans)
                console.error(`Repayment failed: Loan with ID ${action.data.id} not found.`);
                return state;
            }

        case actiontype.EDIT_LOAN:
            const editLoans = [...state.loans];
            const editIndex = editLoans.findIndex(x => x.id === action.data.id);
            if (editIndex !== -1) {
                editLoans[editIndex] = action.data;
                return { ...state, loans: editLoans };
            } else {
                console.error(`Edit failed: Loan with ID ${action.data.id} not found.`);
                return state;
            }

        default:
            return state;
    }
};

export default loansReducer;
