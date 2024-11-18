
import * as actiontype from '../Store/actions'
import axios from "axios";
import { BASIC_URL } from '../constants.js'
// const URL = 'https://localhost:7030/api';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
export const logIn = async (data, navigate) => {
  try {
    const response = await axios.post(`${BASIC_URL}/LogIn`, { userName: data.UserName, password: data.Password });
    localStorage.setItem('token', response.data.token);
    alert('התחברת בהצלחה');
    console.log(response.data.token)
    navigate('/Home');
  } catch (error) {
    alert('Login error');
  }
};


export const logOut = (navigate) => {
  localStorage.removeItem('token');
  navigate("/");
};

export const getUsers = () => {
  return async dispatch => {
    try {
      const res = await axios.get(`${BASIC_URL}/User`);
      dispatch({ type: actiontype.GET_USERS, data: res.data });
    } catch (error) {
      console.error(error);
    }
  }
}
export const addUser = (data) => {
  return async dispatch => {
    try {
      const userConfirmation = window.confirm(`האם אתה בטוח שברצונך להוסיף משתמש חדש בשם  ${data.firstName} ${[data.lastName]} ?`);
      if (!userConfirmation) {
        return;
      }
      dispatch(actiontype.startLoading());
      const res = await axios.post(`${BASIC_URL}/User`, data);
      dispatch({ type: actiontype.ADD_USER, data: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(actiontype.endLoading());
      alert("משתמש נוסף בהצלחה")
    }
  }
}
export const editUser = (data) => {
  return async dispatch => {
    try {
      const userConfirmation = window.confirm(`האם אתה בטוח שברצונך לערוך משתמש ${data.identity} ?`);
      if (!userConfirmation) {
        return;
      }
      dispatch(actiontype.startLoading());
      const res = await axios.put(`${BASIC_URL}/User/${data.id}`, { ...data });
      dispatch({ type: actiontype.EDIT_USER, data: res.data });


    } catch (error) {
      console.error(error);
    } finally {
      dispatch(actiontype.endLoading());
      alert("משתמש נערך בהצלחה")
    }
  }
}
export const fetchDepositGuaranteeAmount = async (userId) => {

  try {
    var res = await axios.get(`${BASIC_URL}/User/${userId}/BalanceGuaranteeAmount`);
    return res.data;

  } catch (error) {
    console.error("Error fetching deposit guarantee amount:", error);
    return null;
  }
}
export const getGuaranteeAmount = async (userId) => {

  try {
    var res = await axios.get(`${BASIC_URL}/User/${userId}/GuaranteeAmount`);
    return res.data;

  } catch (error) {
    console.error("Error fetching deposit guarantee amount:", error);
    return null;
  }
}
//   export const fetchDepositGuaranteeAmount = (users, navigate) => {
//     return async dispatch => {
//         try {
//             dispatch(actiontype.startLoading()); // מצב טעינה מתחיל

//             // מבצע לולאה על כל המשתמשים
//             const updatedUsers = await Promise.all(users.map(async (user) => {
//                 const { id, remainingAmount } = user; // הנחת המבנה של אובייקט המשתמש
//                 const res = await axios.get(`${URL}/User/${user.id}/DepositGuaranteeAmount`)
//                 return res.data; // מחזיר את המידע המעודכן של המשתמש
//             }));

//             console.log(updatedUsers); // הדפסת הרשימה המעודכנת של המשתמשים

//             alert('עריכה בוצעה בהצלחה');
//             navigate('/LoansList');
//         } catch (error) {
//             console.error("Error updating loans:", error);
//         } finally {
//             dispatch(actiontype.endLoading()); // סיום מצב טעינה
//         }
//     }
// };

