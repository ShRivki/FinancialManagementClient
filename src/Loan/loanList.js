import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLoans } from '../Services/loanService';
import { useLocation } from 'react-router-dom';
import LoanDetails from './LoanDetails';
import SortFilter from '../User/sortFilter';  // שים לב לשם הנכון של הקומפוננטה
import { Typography, Box, Divider } from '@mui/material';

const LoansList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const allLoans = useSelector(state => state.Loan.loans);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    if (!state?.loans) {
      dispatch(getLoans());
    }
  }, [dispatch, state]);

  const loans = state?.loans || allLoans;

  console.log(loans); // בדוק את התוכן של loans

  // Define your sort functions
  const sortFunctions = {
    amountAsc: (a, b) => a.amount - b.amount,
    amountDesc: (a, b) => b.amount - a.amount,
    dateAsc: (a, b) => new Date(a.loanDate) - new Date(b.loanDate),
    dateDesc: (a, b) => new Date(b.loanDate) - new Date(a.loanDate),
    repaymentDateAsc: (a, b) => new Date(a.repaymentDate) - new Date(b.repaymentDate),
    repaymentDateDesc: (a, b) => new Date(b.repaymentDate) - new Date(a.repaymentDate),
    nameAsc: (a, b) => a.borrower.firstName.localeCompare(b.borrower.firstName),
    nameDesc: (a, b) => b.borrower.firstName.localeCompare(a.borrower.firstName),
  };

  // Define your sort options
  const sortOptions = [
    { value: 'default', label: 'ברירת מחדל' },
    { value: 'amountAsc', label: 'סכום (מנמוך לגבוה)' },
    { value: 'amountDesc', label: 'סכום ( מגבוה לנמוך)' },
    { value: 'dateAsc', label: 'תאריך (הישן לחדש)' },
    { value: 'dateDesc', label: 'תאריך (החדש לישן)' },
    { value: 'nameAsc', label: 'שם (א–ת)' },
    { value: 'nameDesc', label: 'שם (ת–א)' },
    { value: 'repaymentDateAsc', label: 'תאריך פרעון (הקדום המאוחר)' },
    { value: 'repaymentDateDesc', label: 'תאריך פרעון (המאוחר להקדום)' },
];


  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  return (
    <Box sx={{ p: 2 }}>
      <SortFilter
        items={loans}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortFunctions={sortFunctions}
        sortOptions={sortOptions}
      >
        {(sortedItems) => (
          <>
            <Divider sx={{ mb: 2 }} />
            {sortedItems.length === 0
              ? <Typography variant="h6" align="center" sx={{ mt: 4 }}>No Loans available</Typography>
              : sortedItems.map((loan, index) => (
                  loan ? <LoanDetails key={index} loan={loan} /> : null
                ))
            }
          </>
        )}
      </SortFilter>
    </Box>
  );
};

export default LoansList;
