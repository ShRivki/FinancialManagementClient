import * as actiontype from '../Store/actions'
import axios from "axios";

const URL = 'https://localhost:7030/api/Loan';

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
            // console.log(res.data)
        } catch (error) {
            console.error(error);
        }
        // finally {
        //     dispatch(actiontype.endLoading()); // סיום מצב טעינה
        // }
    }
}
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
