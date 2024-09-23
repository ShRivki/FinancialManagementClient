import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header/Header.js';
import LogIn from './User/logIn.js';
import UserList from './User/userList.js';
import DonationsList from './Donation/donationList.js';
import AddDonation from './Donation/addDonation.js';
import DepositsList from './Deposit/depositList.js';
import GuaranteeList from './Guarantee/guaranteeList.js';
import LoansList from './Loan/loanList.js';
import LoanAddEdit from './Loan/loanAddEdit.js';
import Home from './Home/home.js';
import { getUsers } from './Services/userService.js';
import { getDeposits } from './Services/depositService.js';

function App() {
  const loading = useSelector(state => state.Loading.loading);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token'); // בדוק אם יש טוקן

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getDeposits());
  }, [dispatch]);

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
        <Route path="/DonationsList" element={token ? <DonationsList /> : <Navigate to="/" />} />
        <Route path="/addDonation" element={token ? <AddDonation /> : <Navigate to="/" />} />
        <Route path="/DepositsList" element={token ? <DepositsList /> : <Navigate to="/" />} />
        <Route path="/GuaranteeList" element={token ? <GuaranteeList /> : <Navigate to="/" />} />
        <Route path="/LoansList" element={token ? <LoansList /> : <Navigate to="/" />} />
        <Route path="/loanAddEdit" element={token ? <LoanAddEdit /> : <Navigate to="/" />} />
        <Route path="/Home" element={token ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
