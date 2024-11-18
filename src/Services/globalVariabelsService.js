import * as actiontype from '../Store/actions'
import axios from "axios";
import {currencyOptionsValue}from '../constants'
import { BASIC_URL } from '../constants';

const URL = `${BASIC_URL}/GlobalVariables`;

export const getGlobalVariables = () => {
    return async dispatch => {
        try {
            const res = await axios.get(URL);
            console.log(res.data)
            dispatch({ type: actiontype.GET_GLOBAL_VARIABELS, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}
export const subBalance = (operatingExpenses,currency) => {
    return async dispatch => {
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להוריד סכום בסך ${operatingExpenses} ${currencyOptionsValue[currency]}?`);
            if (!userConfirmation) {
                // אם המשתמש לוחץ על ביטול - סיום הפעולה
                return;
            }
            await axios.put(`${URL}/${operatingExpenses}/${currency}`);
            dispatch({ type: actiontype.SUB_BALANCE, data: operatingExpenses,currency:currency });
        } catch (error) {
            console.error(error);
        }
    }

}