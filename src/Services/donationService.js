import * as actiontype from '../Store/actions';
import axios from "axios";

const URL = 'https://localhost:7030/api/Donation';

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
            const res = await axios.post(URL, data);
            console.log(res);
            dispatch({ type: actiontype.ADD_DONATION, data: res.data });
            alert("התרומה נוספה בהצלחה !!!");
        } catch (error) {
            console.error(error);
        } finally {
            dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        }
    }
}
