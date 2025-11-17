import * as actiontype from '../Store/actions';
import axios from "axios";
import { BASIC_URL ,formatCurrency,currencyOptionsValue} from '../constants';
import { getGlobalVariables } from './globalVariabelsService';
const URL = `${BASIC_URL}/Donation`;

export const getDonations = () => {
    return async dispatch => {
        // dispatch({ type: actiontype.LOADING_START }); // התחלת טעינה
        try {
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_DONATIONS, data: res.data });
        } catch (error) {
            console.error(error);
        } 
        // finally {
        //     dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        // }
    }
}

export const addDonation = (data) => {
    return async dispatch => {
        dispatch({ type: actiontype.LOADING_START }); // התחלת טעינה
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להוסיף תרומה בסך  ${formatCurrency(data.amount)} ${currencyOptionsValue[data.currency]} ?`);
            if (!userConfirmation) {
                return;
            }
            console.log(data);
            const res = await axios.post(URL, data);
            dispatch({ type: actiontype.ADD_DONATION, data: res.data });
            await dispatch(getGlobalVariables()); // עדכון סכומי המנהלים
            alert("התרומה נוספה בהצלחה !!!");
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        }
    }
}
