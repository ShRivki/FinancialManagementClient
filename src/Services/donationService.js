import * as actiontype from '../Store/actions'
import axios from "axios";


const URL = 'https://localhost:7030/api/Donation';

export const getDonations = () => {
    return async dispatch => {
        try {
            const res = await axios.get(URL);
            dispatch({ type: actiontype.GET_DONATIONS, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}
export const addDonation = (data) => {
    alert("fsdfds")
    return async dispatch => {
        try {
            const res = await axios.post(URL, data);
            console.log(res)
            dispatch({ type: actiontype.ADD_DONATION, data: res.data });
        } catch (error) {
            console.error(error);
        }
    }
}
// axios.interceptors.request.use(
//     config => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//       return config;
//     },
//     error => {
//       return Promise.reject(error);
//     }
//   );
  