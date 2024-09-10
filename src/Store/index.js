import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'
import userReducer from './userReducer';
import donationsReducer from './donationReducer';
import depositsReducer from './depositReducer'
import loansReducer from './loanReducer';
import globalReducer from './globalReducer';
import loadingReducer  from './loadingReducer'
const reducers = combineReducers({
    User:userReducer,
    Donations:donationsReducer,
    Deposits:depositsReducer,
    Loan:loansReducer,
    GlobalVariables:globalReducer,
    Loading:loadingReducer
    
})
export const store = createStore(reducers, applyMiddleware(thunk));