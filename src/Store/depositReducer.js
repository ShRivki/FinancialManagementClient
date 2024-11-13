import * as actiontype from './actions'
const initialState = {
    deposits: [],
    inactiveDeposits:[]
}
const depositsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.GET_DEPOSITS: {
            return { ...state, deposits: action.data };
        }
        case actiontype.GET_INACTIVE_DEPOSITS:
            return { ...state, inactiveDeposits: action.data };
        case actiontype.ADD_DEPOSIT: {
            const deposits = [...state.deposits];
            deposits.push(action.data);
            return { ...state, deposits }
        }
        case actiontype.REPAYMENT_DEPOSIT: {
            console.log(action.data)
            // const deposits = state.deposits.filter(x => x.id !== action.id)
            // console.log(deposits)
            // return { ...state, deposits }
            const repaymentDeposits = [...state.deposits];
            const repaymentIndex = repaymentDeposits.findIndex(x => x.id === action.data.id);
            if (repaymentIndex !== -1) {
                repaymentDeposits[repaymentIndex] = action.data;
                return { ...state, deposits: repaymentDeposits };
            } else {
                console.error(`Repayment failed: Loan with ID ${action.data.id} not found.`);
                return state;
            }
        }

        default: return { ...state };
    }

}


export default depositsReducer