import * as actiontype from '../Store/actions'
import axios from "axios";
import { currencyOptionsValue, formatCurrency, BASIC_URL } from '../constants'
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
        return res.data;
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

const checkBorrowerLoans = async (borrower) => {
    if (borrower.loans && borrower.loans.length > 0) {
        const loansDetails = borrower.loans.map(
            loan => `הלוואה מספר ${loan.id} על סך יתרה לתשלום ${formatCurrency(loan.remainingAmount)} ${currencyOptionsValue[loan.currency]}`
        ).join('\n');

        return window.confirm(
            `ללווה ${borrower.firstName} ${borrower.lastName} קיימות ההלוואות הבאות:\n${loansDetails}\n\nהאם להמשיך בהוספת הלוואה חדשה?`
        );
    }
    return true; // אין הלוואות, ממשיך באופן אוטומטי
};

const checkBorrowerGuarantees = async (borrower) => {
    if (borrower.guarantees && borrower.guarantees.length > 0) {
        const guaranteesDetails = borrower.guarantees.map(
            guarantee => `ערבות להלוואה מספר ${guarantee.loan.id} על סך ${formatCurrency(guarantee.loan.remainingAmount)} ${currencyOptionsValue[guarantee.loan.currency]}`
        ).join('\n');

        return window.confirm(
            `ללווה ${borrower.firstName} ${borrower.lastName} קיימות הערבויות הבאות:\n${guaranteesDetails}\n\nהאם להמשיך בהוספת הלוואה חדשה?`
        );
    }
    return true; // אין ערבויות, ממשיך באופן אוטומטי
};

const checkGuarantorDetails = async (guarantor) => {
    if (guarantor.guarantees && guarantor.guarantees.length > 0) {
        const guaranteesDetails = guarantor.guarantees.map(
            guarantee => `ערבות להלוואה מספר ${guarantee.loan.id} על סך ${formatCurrency(guarantee.loan.remainingAmount)}`
        ).join('\n');

        const guaranteesConfirmation = window.confirm(
            `לערב ${guarantor.firstName} ${guarantor.lastName} קיימות הערבויות הבאות:\n${guaranteesDetails}\n\nהאם להמשיך?`
        );
        if (!guaranteesConfirmation) return false;
    }

    if (guarantor.loans && guarantor.loans.length > 0) {
        const loansDetails = guarantor.loans.map(
            loan => `הלוואה מספר ${loan.id} על סך יתרה לתשלום ${formatCurrency(loan.remainingAmount)}`
        ).join('\n');

        const loansConfirmation = window.confirm(
            `לערב ${guarantor.firstName} ${guarantor.lastName} קיימות ההלוואות הבאות:\n${loansDetails}\n\nהאם להמשיך?`
        );
        if (!loansConfirmation) return false;
    }
    return true; // אין ערבויות או הלוואות, ממשיך באופן אוטומטי
};

const checkAllGuarantors = async (guarantees) => {
    for (const g of guarantees) {
        const guarantor = await getUserById(g.guarantorId);
        const result = await checkGuarantorDetails(guarantor);
        if (!result) return false;
    }
    return true; // כל הערבים אושרו
};

export const addLoan = (data, navigate) => {
    return async dispatch => {
        try {
            const borrower = await getUserById(data.borrowerId);

            const loansOk = await checkBorrowerLoans(borrower);
            if (!loansOk) return;

            const guaranteesOk = await checkBorrowerGuarantees(borrower);
            if (!guaranteesOk) return;

            const guarantorsOk = await checkAllGuarantors(data.guarantees);
            if (!guarantorsOk) return;

            const userConfirmation = window.confirm(
                `האם אתה בטוח שברצונך להוסיף הלוואה על סך ${formatCurrency(data.amount)} ${currencyOptionsValue[data.currency]}?`
            );
            if (!userConfirmation) return;

            dispatch(actiontype.startLoading());
            const res = await axios.post(URL, { ...data });
            dispatch({ type: actiontype.ADD_LOAN, data: res.data });
            alert('הוספה בוצעה בהצלחה');
            navigate('/LoansList');
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(actiontype.endLoading());
        }
    };
};


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
export const removeLoan = (id) => {
    return async dispatch => {
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך לבצע מחיקת הלוואה לא תוכל לשחזר אחכ את הפרטים שנמחקו האם לבצע את הפעולה ?`);
            if (!userConfirmation) {
                return;
            }
            dispatch(actiontype.startLoading()); // מצב טעינה מתחיל
            const res = await axios.delete(`${URL}/Delete/${id}`);
            dispatch({ type: actiontype.DELETE_LOAN, data: res.data });
            alert('ההלוואה נמחקה בהצלחה');
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
