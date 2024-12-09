import * as actiontype from '../Store/actions';
import axios from "axios";
import { currencyOptionsValue,formatCurrency,BASIC_URL } from '../constants'

const URL = `${BASIC_URL}/Deposit`;

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
export const getInactiveDeposits = () => {
    return async dispatch => {
        // dispatch({ type: actiontype.LOADING_START }); // התחלת טעינה
        try {
            const res = await axios.get(`${URL}?active=false`);
            dispatch({ type: actiontype.GET_INACTIVE_DEPOSITS, data: res.data });
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
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להוסיף הפקדה על סך ${formatCurrency(data.amount)} ${currencyOptionsValue[data.currency]}?`);
            if (!userConfirmation) {
                // אם המשתמש לוחץ על ביטול - סיום הפעולה
                return;
            }
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
export const updateDepositDate = (id, date) => {
    return async dispatch => {
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך לשנות תאריך החזר הפקדה ל ${date} ?`);
            if (!userConfirmation) {
                return;
            }
            dispatch(actiontype.startLoading());
            const res = await axios.put(`${URL}/${id}/repaymentDate/${date}`); // בקשה לשינוי תאריך החזר
            dispatch({ type: actiontype.REPAYMENT_DEPOSIT, data: res.data }); // עדכון ה-state עם התוצאה
            alert('תאריך ההחזר ההפקדה עודכן בהצלחה');
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(actiontype.endLoading());
        }
    }
}

export const repaymentDeposit = (id, repaymentAmount) => {
    return async dispatch => {
        dispatch({ type: actiontype.LOADING_START });
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להחזיר ${formatCurrency(repaymentAmount)} ?`);
            if (!userConfirmation) {
                return;
            }
            const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}`);
            dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
            alert(`הוחזר ${repaymentAmount} בהצלחה`);
        } catch (error) {
            // אם השגיאה מכילה את ההודעה על כך שנדרש אישור מנהל
            if (error.response && error.response.data) {
                // הצגת הודעת השגיאה המקורית
                console.log(error.response.data)
                const errorMessage = error.response?.data?.message || 'שגיאה במהלך החזרה.';
                // setMessage(errorMessage);
                // const errorMessage = error.response.data
                const managerApproval = window.confirm(`${errorMessage}\nהאם להמשיך בכל זאת?`);
                if (managerApproval) {
                    // קריאה חוזרת עם אישור מנהל
                    const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}&managerApproval=true`);
                    dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
                    alert(`הוחזר ${repaymentAmount} בהצלחה`);
                }
            } else {
                // הצגת שגיאה כללית
                alert(error.response.data || "שגיאה בלתי צפויה");
            }
        } finally {
            dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
        }
    };
};

export const getDepositsByDate = async (untilDate) => {
    try {
        const response = await axios.get(`${URL}/upToDate/${untilDate}`);
        return response.data;

    } catch (error) {
        console.error('Error fetching deposits by date:', error);
        throw error;
    }
};