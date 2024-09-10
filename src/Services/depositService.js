import * as actiontype from '../Store/actions';
import axios from "axios";

const URL = 'https://localhost:7030/api/Deposit';

export const getDeposits = () => {
    return async dispatch => {
        // dispatch({ type: actiontype.LOADING_START }); // התחלת טעינה
        try {
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_DEPOSITS, data: res.data });
        } catch (error) {
            console.error(error);
        }
        //  finally {
        //     dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        // }
    }
}

export const addDeposit = (data) => {
    return async dispatch => {
        dispatch({ type: actiontype.LOADING_START }); // התחלת טעינה
        try {
            console.log({ ...data, depositDate: new Date().toISOString() });
            const res = await axios.post(URL, { ...data, depositDate: new Date().toISOString() });
            dispatch({ type: actiontype.ADD_DEPOSIT, data: res.data });
            alert(`ההפקדה נוספה בהצלחה`);
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        }
    }
}

export const repaymentDeposit = (id, repaymentAmount) => {
    return async dispatch => {
        dispatch({ type: actiontype.LOADING_START }); // התחלת טעינה
        try {
            const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}`);
            dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
            alert(`הוחזר ${repaymentAmount} בהצלחה`);
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        }
    };
};
