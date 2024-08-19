import * as actiontype from './actions'
const initialState = {
    donations: []
}
const donationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.GET_DONATIONS: {
            return { ...state, donations: action.data };
        }
        case actiontype.ADD_DONATION: {
            const donations = [...state.donations];
            donations.push(action.data);
            return { ...state, donations }
        }
        default: return { ...state };
    }

}


export default donationsReducer