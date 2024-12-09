import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Header from './Header/Header.js';
import LogIn from './User/logIn.js';
import { jwtDecode } from 'jwt-decode';
import UserList from './User/userList.js';
import DonationsList from './Donation/donationList.js';
import AddDonation from './Donation/addDonation.js';
import DepositsList from './Deposit/depositList.js';
import GuaranteeList from './Guarantee/guaranteeList.js';
import LoansList from './Loan/loanList.js';
import LoanAddEdit from './Loan/loanAddEdit.js';
import Home from './Home/home.js';
import CurrentPendingItems from './Global/currentPendingItems.js'
import { getUsers, logOut } from './Services/userService.js';
import { getDeposits } from './Services/depositService.js';
import { getLoans } from './Services/loanService.js';
import { IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

function App() {
  const loading = useSelector(state => state.Loading.loading);
  const dispatch = useDispatch();
  const token = useSelector(state => state.User.token);
  const navigate = useNavigate();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // גלילה חלקה
    });
  };
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        await dispatch(getUsers());
        await dispatch(getLoans());
        await dispatch(getDeposits());
        console.log("finish")
      };

      fetchData();
    }
  }, [token]);
  useEffect(() => {
    const checkTokenValidity = () => {
      if (token) {
        const token2 = localStorage.getItem('token')
        const decodedToken = jwtDecode(token2);
        const currentTime = Date.now() / 1000; // הזמן הנוכחי בשניות
        if (decodedToken.exp && decodedToken.exp < currentTime && window.location.pathname !== '/') {
          alert('החיבור פג תוקף');
          dispatch(logOut(navigate))
          // window.location.href = '/'; // ניתוב מחדש לדף ההתחברות
        }
      }
    };

    checkTokenValidity();

    // בדיקה מחזורית כל 5 דקות (ניתן לשנות)
    const interval = setInterval(checkTokenValidity, 300000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="App">
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <CircularProgress />
        </Box>
      )}

      <Header />
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/UserList" element={token ? <UserList /> : <Navigate to="/" />} />
        <Route path="/CurrentPendingItems" element={token ? <CurrentPendingItems /> : <Navigate to="/" />} />
        <Route path="/DonationsList" element={token ? <DonationsList /> : <Navigate to="/" />} />
        <Route path="/addDonation" element={token ? <AddDonation /> : <Navigate to="/" />} />
        <Route path="/DepositsList" element={token ? <DepositsList /> : <Navigate to="/" />} />
        <Route path="/GuaranteeList" element={token ? <GuaranteeList /> : <Navigate to="/" />} />
        <Route path="/LoansList" element={token ? <LoansList /> : <Navigate to="/" />} />
        <Route path="/loanAddEdit" element={token ? <LoanAddEdit /> : <Navigate to="/" />} />
        <Route path="/Home" element={token ? <Home /> : <Navigate to="/" />} />
      </Routes>
      <div style={{
        position: 'fixed', bottom: 10, right: 10, fontSize: '14px', color: 'black', zIndex: 1000,
        fontFamily: 'Arial, sans-serif', textAlign: 'right', direction: 'rtl', writingMode: 'vertical-rl', transform: 'rotate(180deg)'
      }}>
        <span>© כל הזכויות שמורות. </span>
        <span>Rivka Shraiber - R0548524600@gmail.com</span>
      </div><IconButton 
      onClick={scrollToTop} 
      sx={{
        position: 'fixed',
        bottom: '20px',
        right: '30px',
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
      }}
    >
      <ArrowUpwardIcon />
    </IconButton>


    </div>
  );
}

export default App;
