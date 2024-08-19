import * as actiontype from '../Store/actions'
import axios from "axios";


const URL = 'https://localhost:7030/api/Deposit';

export const getDeposits = () => {
    return async dispatch => {
        try {
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_DEPOSITS, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}
export const addDeposit = (data) => {
    return async dispatch => {
        try {
            console.log({...data, depositDate: new Date().toISOString() })
            const res = await axios.post(URL, {...data, depositDate: new Date().toISOString() } );
            dispatch({ type: actiontype.ADD_DEPOSIT, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}
export const repaymentDeposit = (id) => {
    return async dispatch => {
        try { 
            const res = await axios.delete(`${URL}/${id}`);
            dispatch({ type: actiontype.REPAYMENT_DEPOSIT, data:res.data.id});
        } catch (error) {
            console.error(error);
        }
    }
}