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
    nameAsc: (a, b) => a.borrower.firstName.localeCompare(b.borrower.firstName),
    nameDesc: (a, b) => b.borrower.firstName.localeCompare(a.borrower.firstName),
  };

  // Define your sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'amountAsc', label: 'Amount (Low to High)' },
    { value: 'amountDesc', label: 'Amount (High to Low)' },
    { value: 'dateAsc', label: 'Date (Oldest to Newest)' },
    { value: 'dateDesc', label: 'Date (Newest to Oldest)' },
    { value: 'nameAsc', label: 'Name (A to Z)' },
    { value: 'nameDesc', label: 'Name (Z to A)' },
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
