import './App.css';
import React, { useEffect } from 'react';
import LogIn from './User/logIn.js';
import { Route, Routes } from "react-router-dom";
import Header from './Header/Header.js'
import UserList from './User/userList.js'
import DonationsList from './Donation/donationList.js'
import './App.css';
import { useDispatch } from 'react-redux';
import AddDonation from './Donation/addDonation.js';
import { getUsers } from './Services/userService.js';
import DepositsList from './Deposit/depositList.js'
import LoansList from './Loan/loanList.js';
import LoanAddEdit from './Loan/loanAddEdit.js'
import GuaranteeList from './Guarantee/guaranteeList.js';
import Home from './Home/home.js'
// const HomePage = React.lazy(() => import('./HomePage.js'));
// const LogIn = React.lazy(() => import('./User/LogIn.js'));
// const LogOut = React.lazy(() => import('./User/LogOut.js'));
// const EmployeeList = React.lazy(() => import('./Employee/EmployeeList.js'));
// const AddEmployee = React.lazy(() => import('./Employee/AddEmployee.js'));
// const EmployeeDetails = React.lazy(() => import('./Employee/EmployeeDetails.js'));
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <div className="App">
        <Header/>
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
              {/* <Route path="/" element={<React.Suspense fallback={<div>Loading...</div>}><HomePage /></React.Suspense>} />
              <Route path="/HomePage" element={<React.Suspense fallback={<div>Loading...</div>}><HomePage /></React.Suspense>} />
              <Route path="/Login" element={<React.Suspense fallback={<div>Loading...</div>}><LogIn /></React.Suspense>} />
              <Route path="/LogOut" element={<React.Suspense fallback={<div>Loading...</div>}><LogOut /></React.Suspense>} />
              <Route path="/EmployeeList" element={<React.Suspense fallback={<div>Loading...</div>}><EmployeeList /></React.Suspense>}>
                <Route path="EmployeeDetails" element={<React.Suspense fallback={<div>Loading...</div>}><EmployeeDetails /></React.Suspense>} />
                <Route path="AddEmployee" element={<React.Suspense fallback={<div>Loading...</div>}><AddEmployee /></React.Suspense>} />
              </Route>
              <Route path="/*" element={<Error />} /> */}
            </Routes>
    </div>
  );
}

export default App;
