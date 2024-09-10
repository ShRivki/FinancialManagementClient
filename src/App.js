import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
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

function App() {
  const loading = useSelector(state => state.Loading.loading); // גישה נכונה ל-state
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
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
        <Route path="/UserList" element={<UserList />} />
        <Route path="/DonationsList" element={<DonationsList />} />
        <Route path="/addDonation" element={<AddDonation />} />
        <Route path="/DepositsList" element={<DepositsList />} />
        <Route path="/GuaranteeList" element={<GuaranteeList />} />
        <Route path="/LoansList" element={<LoansList />} />
        <Route path="/loanAddEdit" element={<LoanAddEdit />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
