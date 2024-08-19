import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import userReducer from './userReducer';
import donationsReducer from './donationReducer';
import depositsReducer from './depositReducer'
import loansReducer from './loanReducer';
const reducers = combineReducers({
    User:userReducer,
    Donations:donationsReducer,
    Deposits:depositsReducer,
    Loan:loansReducer
})
export const store = createStore(reducers, applyMiddleware(thunk));