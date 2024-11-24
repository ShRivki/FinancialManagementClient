import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLoans, getInactiveLoans } from '../Services/loanService';
import { useLocation } from 'react-router-dom';
import LoanDetails from './loanDetails';
import SortFilter from '../User/sortFilter';
import { Typography, Box, Divider, Checkbox, FormControlLabel } from '@mui/material';
import ExportButton from '../exportButton';

const LoansList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const allLoans = useSelector(state => state.Loan.loans);
  const allInactiveLoans = useSelector(state => state.Loan.inactiveLoans);
  const [sortOrder, setSortOrder] = useState('dateDesc');
  const [showInactive, setShowInactive] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getInactiveLoans());
      await dispatch(getLoans());
    };
  
    fetchData();
  }, []);
  const loans = state?.loans ?? (showInactive ? allLoans : allInactiveLoans);

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleDateString('he-IL'); 
  }
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
      {!state?.loans && <FormControlLabel
        control={<Checkbox checked={showInactive} onChange={() => setShowInactive(!showInactive)} color="primary" />}
        label={'הצג הלוואות פעילות'}
      />}
      <SortFilter
        items={loans}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortFunctions={sortFunctions}
        sortOptions={sortOptions}
      >

        {(sortedItems) => (
          <>
            <ExportButton
              data={loans.map(loan => ({
                'מזהה הלוואה ': loan.id,
                'מזהה לווה': loan.borrower.identity,
                'שם פרטי': loan.borrower.firstName,
                'שם משפחה': loan.borrower.lastName,
                'תאריך לקיחת הלוואה ': formatDate(loan.loanDate),
                'סכום הלוואה': loan.amount,
                'סכום שנותר לתשלום ': loan.remainingAmount,
                'תאריך החזר ראשון ': formatDate(loan.repaymentDate),
                'תדירות בחזר בחודשים': loan.frequency,
                'סכום ההחזר הבא': loan.monthlyRepayment,
                'תשלום נוכחי': loan.currentPayment,
                'כמות תשלומים': loan.totalPayments,
                'סטטוס': loan.status ? 'פעיל' : 'לא פעיל',
              }))}
              fileName={`LoansList_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.xlsx`}
            />
            <Divider sx={{ mb: 2 }} />
            {sortedItems.length === 0
              ? <Typography variant="h6" align="center" sx={{ mt: 4 }}>אין הלוואות</Typography>
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
