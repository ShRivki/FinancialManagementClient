import * as actiontype from './actions'
const initialState = {
    deposits: []
}
const depositsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.GET_DEPOSITS: {
            return { ...state, deposits: action.data };
        }
        case actiontype.ADD_DEPOSIT: {
            const deposits = [...state.deposits];
            deposits.push(action.data);
            return { ...state, deposits }
        }
        case actiontype.REPAYMENT_DEPOSIT:{
            console.log(action.data)
            const deposits = state.deposits.filter(x => x.id !== action.data)
            console.log(deposits)
            return { ...state, deposits }
        }
        default: return { ...state };
    }

}


export default depositsReducer