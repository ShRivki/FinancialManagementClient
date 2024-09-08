import * as actiontype from '../Store/actions'
import axios from "axios";


const URL = 'https://localhost:7030/api/Loan';

export const getLoans = () => {
    return async dispatch => {
        try {
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_LOANS, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}
export const addLoan = (data,navigate) => {
    return async dispatch => {
        try {
            const res = await axios.post(URL, data);
            dispatch({ type: actiontype.ADD_LOAN, data: res.data });
            alert('`add` in successfully');
            navigate('/LoansList');
        } catch (error) {
            console.error(error);
        }
    }
}
export const repaymentLoan = (id) => {
    return async dispatch => {
        try {
            const res = await axios.delete(`${URL}/${id}`);
            console.log(res.data);
            dispatch({ type: actiontype.REPAYMENT_LOAN, data: res.data });
           
        } catch (error) {
            console.error(error);
        }
    }
}
export const editLoan = (data,id,navigate) => {
    alert("edit")
    console.log(data)
    return async dispatch => {
        try {
            const res = await axios.put(`${URL}/${id}`, { ...data });
            console.log("editeeee")
            console.log(res.data);
            dispatch({ type: actiontype.EDIT_LOAN, data: res.data });
            alert('`edit` in successfully');
            navigate('/LoansList');
        } catch (error) {
            console.error(error);
        }
    }

}