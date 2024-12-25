import * as actiontype from '../Store/actions';
import axios from "axios";
import { currencyOptionsValue,formatCurrency,BASIC_URL } from '../constants'

const URL = `${BASIC_URL}/Deposit`;
const selectFiles = async () => {
    const addFileConfirmation = window.confirm("האם תרצה להוסיף קבצים?");
    let files = [];

    if (addFileConfirmation) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '*'; // אפשר להגדיר פורמטים ספציפיים אם צריך
        fileInput.multiple = true; // תמיכה בהעלאת קבצים מרובים
        fileInput.style.display = 'none';

        document.body.appendChild(fileInput);

        const filePromise = new Promise((resolve) => {
            fileInput.onchange = () => {
                resolve(Array.from(fileInput.files)); // מחזיר את הקבצים שנבחרו כ-array
                document.body.removeChild(fileInput); // מסיר את ה-input מהדף
            };
        });

        fileInput.click();
        files = await filePromise;
    }

    return files;
};

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
    return async (dispatch) => {
        dispatch({ type: actiontype.LOADING_START });

        try {
            const userConfirmation = window.confirm(
                `האם אתה בטוח שברצונך להוסיף הפקדה על סך ${formatCurrency(data.amount)} ${currencyOptionsValue[data.currency]}?`
            );

            if (!userConfirmation) {
                return;
            }
            const files = await selectFiles();  // בחר קבצים אם יש

            const formData = new FormData();
            files.forEach(file => {
                formData.append('attachments', file);
            });

            formData.append('value', JSON.stringify({
                ...data,
                depositDate: new Date().toISOString(),
            }));

            const res = await axios.post(URL, formData);
            dispatch({ type: actiontype.ADD_DEPOSIT, data: res.data });
            alert(`ההפקדה נוספה בהצלחה`);
        } catch (error) {
            console.error('שגיאה בהוספת ההפקדה:', error);
            alert('אירעה שגיאה במהלך הוספת ההפקדה. נסה שנית.');
        } finally {
            dispatch({ type: actiontype.LOADING_END });
        }
    };
};





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

// export const repaymentDeposit = (id, repaymentAmount) => {
//     return async dispatch => {
//         dispatch({ type: actiontype.LOADING_START });
//         try {
//             const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להחזיר ${formatCurrency(repaymentAmount)} ?`);
//             if (!userConfirmation) {
//                 return;
//             }
//             const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}`);
//             dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
//             alert(`הוחזר ${repaymentAmount} בהצלחה`);
//         } catch (error) {
//             // אם השגיאה מכילה את ההודעה על כך שנדרש אישור מנהל
//             if (error.response && error.response.data) {
//                 // הצגת הודעת השגיאה המקורית
//                 console.log(error.response.data)
//                 const errorMessage = error.response?.data?.message || 'שגיאה במהלך החזרה.';
//                 // setMessage(errorMessage);
//                 // const errorMessage = error.response.data
//                 const managerApproval = window.confirm(`${errorMessage}\nהאם להמשיך בכל זאת?`);
//                 if (managerApproval) {
//                     // קריאה חוזרת עם אישור מנהל
//                     const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}&managerApproval=true`);
//                     dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
//                     alert(`הוחזר ${repaymentAmount} בהצלחה`);
//                 }
//             } else {
//                 // הצגת שגיאה כללית
//                 alert(error.response.data || "שגיאה בלתי צפויה");
//             }
//         } finally {
//             dispatch({ type: actiontype.LOADING_END }); // סיום טעינה
//         }
//     };
// };
export const repaymentDeposit = (id, repaymentAmount) => {
    return async dispatch => {
        dispatch({ type: actiontype.LOADING_START });
        const formData = new FormData();
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להחזיר ${formatCurrency(repaymentAmount)} ?`);
            if (!userConfirmation) {
                return;
            }
            const files = await selectFiles(); 
            files.forEach(file => {
                formData.append('attachments', file);
            });

            formData.append('value', JSON.stringify({
                repaymentAmount,
                // כאן תוכל להוסיף פרטים נוספים אם צריך
            }));

            const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}`, { data: formData });
            dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
            alert(`הוחזר ${repaymentAmount} בהצלחה`);
        } catch (error) {
            // אם השגיאה מכילה את ההודעה על כך שנדרש אישור מנהל
            if (error.response && error.response.data) {
                console.log(error.response.data);
                const errorMessage = error.response?.data?.message || 'שגיאה במהלך החזרה.';
                const managerApproval = window.confirm(`${errorMessage}\nהאם להמשיך בכל זאת?`);
                if (managerApproval) {
                    const res = await axios.delete(`${URL}/${id}?repaymentAmount=${repaymentAmount}&managerApproval=true`, { data: formData });
                    dispatch({ type: actiontype.REPAYMENT_DEPOSIT, amount: repaymentAmount, data: res.data });
                    alert(`הוחזר ${repaymentAmount} בהצלחה`);
                }
            } else {
                alert(error.response.data || "שגיאה בלתי צפויה");
            }
        } finally {
            dispatch({ type: actiontype.LOADING_END });
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