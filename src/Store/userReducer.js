import * as actiontype from './actions'
const initialState = {
    token:!!localStorage.getItem('token'),
    users: []
}
const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case actiontype.LOG_IN: {
            return { ...state, token: true };
        }
        case actiontype.LOG_OUT: {
            return { ...state, token: false };
        }
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
            const findIndex = users.findIndex(x => x.id===action.data.id);
            users[findIndex] = action.data;
            return { ...state, users }
        }
        default: return { ...state };
    }

}


export default usersReducer