
import { date } from 'yup';
import * as actiontype from '../Store/actions'
import axios from "axios";

const URL = 'https://localhost:7030/api';

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
    const response = await axios.post(`${URL}/LogIn`, { userName: data.UserName, password: data.Password });
    localStorage.setItem('token', response.data.token);
    alert('`Logged` in successfully');
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
      const res = await axios.get(`${URL}/User`);
      dispatch({ type: actiontype.GET_USERS, data: res.data });
    } catch (error) {
      console.error(error);
    }
  }
}
export const addUser = (data) => {
  return async dispatch => {
    try {
      dispatch(actiontype.startLoading());
      const res = await axios.post(`${URL}/User`, data);
      console.log(res.data);
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
  console.log(data);
  return async dispatch => {
    try {
      dispatch(actiontype.startLoading());
      const res = await axios.put(`${URL}/User/${data.id}`, { ...data });
      dispatch({ type: actiontype.EDIT_USER, data: res.data });

    } catch (error) {
      console.error(error);
    } finally {
      dispatch(actiontype.endLoading());
      alert("משתמש נערך בהצלחה")
    }
  }
}

