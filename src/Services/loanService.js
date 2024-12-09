import * as actiontype from '../Store/actions'
import axios from "axios";
import { currencyOptionsValue,formatCurrency,BASIC_URL } from '../constants'
import { getUserById } from './userService'
const URL = `${BASIC_URL}/Loan`;
export const getLoans = () => {
    return async dispatch => {
        try {
            //dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_LOANS, data: res.data });
        } catch (error) {
            console.error(error);
        }
        // finally {
        //     dispatch(actiontype.endLoading()); // סיום מצב טעינה
        // }
    }
}
export const updateRepaymentDate = (id, date) => {
    return async dispatch => {
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך לשנות תאריך הבא להחזר הלוואה ל ${date} ?`);
            if (!userConfirmation) {
                return;
            }
            dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.put(`${URL}/${id}/repaymentDate/${date}`); // בקשה לשינוי תאריך החזר
            dispatch({ type: actiontype.EDIT_LOAN, data: res.data }); // עדכון ה-state עם התוצאה
            alert('תאריך ההחזר עודכן בהצלחה');
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(actiontype.endLoading()); // סיום מצב טעינה
        }
    }
}

export const getInactiveLoans = () => {
    return async dispatch => {
        try {
            //dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.get(`${URL}/Inactive`);
            dispatch({ type: actiontype.GET_INACTIVE_LOANS, data: res.data });
        } catch (error) {
            console.error(error);
        }
        // finally {
        //     dispatch(actiontype.endLoading()); // סיום מצב טעינה
        // }
    }
}
export const getInactiveLoansPerUser = (id) => async () => {
    try {
        const res = await axios.get(`${URL}/inactive?id=${id}`);
        return  res.data;
    } catch (error) {
        console.error(error);
    }
};

export const getLoansByDate = async (untilDate) => {
    try {
        const response = await axios.get(`${URL}/upToDate/${untilDate}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching loans by date:', error);
        throw error;
    }
};

export const addLoan = (data, navigate) => {
    return async dispatch => {
        try {
            for (const g of data.guarantees) {
                const user = await getUserById(g.guarantorId);
                if (user.guarantees) {
                    for (const guarantee of user.guarantees) {
                        const userConfirmation = window.confirm(
                            `ערב ${user.firstName} ${user.lastName}  ערב להלוואה מספר ${guarantee.loan.id} על סך ${formatCurrency(guarantee.loan.remainingAmount)} האם להמשיך?`
                        );
                        if (!userConfirmation) {
                            return;
                        }
                    }
                }
                if (user.loans){
                    for (const loan of user.loans) {
                        const userConfirmation = window.confirm(
                            `לערב ${user.firstName} ${user.lastName} קיימת הלוואה פעילה מספר ${loan.id} על סך ${formatCurrency(loan.remainingAmount)}  האם להמשיך?`
                        );
                        if (!userConfirmation) {
                            return;
                        }
                    }
                }
            }
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להוסיף הלוואה על סך ${formatCurrency(data.amount)} ${currencyOptionsValue[data.currency]}?`);
            if (!userConfirmation) {
                // אם המשתמש לוחץ על ביטול - סיום הפעולה
                return;
            }
            console.log(data)
            dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.post(URL, { ...data });
            dispatch({ type: actiontype.ADD_LOAN, data: res.data });
            alert('הוספה בוצעה בהצלחה');
            navigate('/LoansList');
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(actiontype.endLoading()); // סיום מצב טעינה
        }
    }
}

export const repaymentLoan = (id, repaymentAmount) => {
    return async dispatch => {
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך לבצע החזר הלוואה על סך: ${formatCurrency(repaymentAmount)} ?`);
            if (!userConfirmation) {
                return;
            }
            dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const url = repaymentAmount
                ? `${URL}/${id}?repaymentAmount=${repaymentAmount}`
                : `${URL}/${id}`;

            const res = await axios.delete(url);
            dispatch({ type: actiontype.REPAYMENT_LOAN, data: res.data });
            alert('חזר הלוואה  בוצעה בהצלחה');
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(actiontype.endLoading()); // סיום מצב טעינה
        }
    }
}

export const editLoan = (data, id, navigate) => {
    return async dispatch => {
        try {
            dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.put(`${URL}/${id}`, { ...data });
            dispatch({ type: actiontype.EDIT_LOAN, data: res.data });
            alert('עריכה בוצעה בהצלחה');
            navigate('/LoansList');
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(actiontype.endLoading()); // סיום מצב טעינה
        }
    }
}
