import * as actiontype from './actions'
const initialState = {
    users: []
}
const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.GET_USERS: {
            return { ...state, users: action.data };
        }
        case actiontype.ADD_USER: {
            const users = [...state.users];
            users.push(action.data);
            return { ...state, users }
        }
        case actiontype.EDIT_USER: {
            const users = [...state.users];
            const findIndex = users.findIndex(x => x.id==action.data.id);
            users[findIndex] = action.data;
            return { ...state, users }
        }
        default: return { ...state };
    }

}


export default usersReducer