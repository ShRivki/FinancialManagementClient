import * as actiontype from '../Store/actions'
import axios from "axios";
import { BASIC_URL,currencyOptionsValue } from '../constants';

const URL = `${BASIC_URL}/GlobalVariables`;

export const getGlobalVariables = () => {
    return async dispatch => {
        try {
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_GLOBAL_VARIABELS, data: res.data });
            const ratesResponse = await axios.get(`${BASIC_URL}/GlobalVariables/rates`);
            dispatch({ type: actiontype.SET_CURRENCY_RATES, data: ratesResponse.data });
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
export const getHistoryRecords = () => {
    return async dispatch => {
        try {
            const response = await axios.get(`${URL}/HistoryRecord`);
            dispatch({ type: actiontype.GET_HISTORY_RECORDS, data: response.data });
        } catch (error) {
            console.error("Error fetching history records:", error);
        }
    };
};
