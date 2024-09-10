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

export const addLoan = (data, navigate) => {
    return async dispatch => {
        try {
            dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.post(URL, data);
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
