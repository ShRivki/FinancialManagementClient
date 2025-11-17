import * as actiontype from '../Store/actions'
import axios from "axios";
import { BASIC_URL,currencyOptionsValue } from '../constants';

const URL = `${BASIC_URL}/GlobalVariables`;

export const sendReminders = async () => {
    try {
        const res = await axios.post(`${BASIC_URL}/Reminder/send-reminders`);
        console.log('Reminders sent successfully:', res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to send reminders:', error);
        throw error;
    }
}


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
export const subBalance = (operatingExpenses,currency,managerId) => {
    return async dispatch => {
        try {
            const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להוריד סכום בסך ${operatingExpenses} ${currencyOptionsValue[currency]}?`);
            if (!userConfirmation) {
                // אם המשתמש לוחץ על ביטול - סיום הפעולה
                return;
            }
            await axios.put(`${URL}/${operatingExpenses}/${currency}/${managerId}`);
            dispatch({ type: actiontype.SUB_BALANCE, data: operatingExpenses,currency:currency });
            await dispatch(getGlobalVariables()); // עדכון סכומי המנהלים
            alert("הפעולה בוצעה בהצלחה")
        } catch (error) {
            console.error(error);
        }
    }

}
export const transferBetweenManagers = (amount, currency, fromManagerId, toManagerId) => {
    return async dispatch => {
        try {
            const managerNames = {
                0: 'אליהו שרייבר',
                1: 'יעקב פרידמן'
            };
            const userConfirmation = window.confirm(
                `האם אתה בטוח שברצונך להעביר סכום של ${amount} ${currencyOptionsValue[currency]} מ-${managerNames[fromManagerId]} ל-${managerNames[toManagerId]}?`
            );
            if (!userConfirmation) {
                return;
            }
            await axios.put(`${URL}/transfer/${amount}/${currency}/${fromManagerId}/${toManagerId}`);
            await dispatch(getGlobalVariables()); // עדכון סכומי המנהלים
            alert("העברת הסכום בוצעה בהצלחה");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "אירעה שגיאה במהלך העברת הסכום");
        }
    }
};

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

export const Backup = async () => {
    try {
        const response = await axios.post(`${BASIC_URL}/GlobalVariables/backup`);
        if (response.status >= 200 && response.status < 300) {
            alert("גיבוי הושלם בהצלחה!");
        } else {
            alert("הגיבוי נכשל.");
        }
    } catch (error) {
        console.error("שגיאה בעת ניסיון לגבות נתונים:", error);
        alert("אירעה שגיאה במהלך ניסיון הגיבוי.");
    }
};
// export const SendEmail = async () => {
//       const response = await axios.post("https://localhost:7030/api/GlobalVariables/send-email", emailData);
    
//             if (response.status === 200) {
//                 setMessage('ההודעה נשלחה בהצלחה!');
//                 setMessageType('success');
//             } else {
//                 setMessage('שגיאה בשליחת ההודעה.');
//                 setMessageType('error');
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'שגיאה במהלך השליחה.';
//             setMessage(errorMessage);
//             setMessageType('error');
// };
