import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDeposits } from '../Services/depositService';
import { useLocation } from 'react-router-dom';
import DepositDetails from './depositDetails';
import SortFilter from '../User/sortFilter'; // Import the SortFilter component
import { Typography, Box, Divider } from '@mui/material';

const DepositsList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const allDeposits = useSelector((state) => state.Deposits.deposits);

  useEffect(() => {
    if (!state?.deposits) {
      dispatch(getDeposits());
    }
  }, [dispatch, state]);

  const deposits = state?.deposits || allDeposits;

  const sortFunctions = {
    amountAsc: (a, b) => a.amount - b.amount,
    amountDesc: (a, b) => b.amount - a.amount,
    dateAsc: (a, b) => new Date(a.depositDate) - new Date(b.depositDate),
    dateDesc: (a, b) => new Date(b.depositDate) - new Date(a.depositDate),
    repaymentDateAsc: (a, b) => new Date(a.dateOfMaturity) - new Date(b.dateOfMaturity),
    repaymentDateDesc: (a, b) => new Date(b.dateOfMaturity) - new Date(a.dateOfMaturity),
    nameAsc: (a, b) => a.depositor.firstName.localeCompare(b.depositor.firstName),
    nameDesc: (a, b) => b.depositor.firstName.localeCompare(a.depositor.firstName),
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
    // Trigger a re-render with the new sort order
  };

  if (!deposits || deposits.length === 0) {
    return <Typography variant="h6" align="center" sx={{ mt: 4 }}>No deposits available</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <SortFilter
        items={deposits}
        sortOrder={'default'}
        onSortChange={handleSortChange}
        sortFunctions={sortFunctions}
        sortOptions={sortOptions}
      >
        {(sortedDeposits) => (
          <>
            <Divider sx={{ mb: 2 }} />
            {sortedDeposits.map((deposit, index) => (
              <DepositDetails key={index} deposit={deposit} />
            ))}
          </>
        )}
      </SortFilter>
    </Box>
  );
};

export default DepositsList;
