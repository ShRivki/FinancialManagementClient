import * as actiontype from './actions';
const initialState = {
    loading: false
};

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.LOADING_START:
            return { ...state, loading: true };
        case actiontype.LOADING_END:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default loadingReducer;
