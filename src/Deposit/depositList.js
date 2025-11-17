import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDeposits, getInactiveDeposits } from '../Services/depositService';
import { useLocation } from 'react-router-dom';
import DepositDetails from './depositDetails';
import SortFilter from '../User/sortFilter'; 
import { Typography, Box, Divider, FormControlLabel, Checkbox } from '@mui/material';
import ExportButton from '../exportButton';
import { moneyRecipientOptionsValue } from '../constants.js';
const DepositsList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const allDeposits = useSelector((state) => state.Deposits.deposits);
  const allInactiveDeposits = useSelector((state) => state.Deposits.inactiveDeposits);
  const [showInactive, setShowInactive] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getDeposits());
      await dispatch(getInactiveDeposits());
    };
    fetchData();
  }, [dispatch]);
  const deposits = state?.id
    ? allDeposits.filter((deposit) => deposit.depositor.id === state.id)
    : showInactive === false
      ? allInactiveDeposits
      : allDeposits;
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
    return <Box sx={{ p: 2 }}>
    {!state?.loans && <FormControlLabel
      control={<Checkbox checked={showInactive} onChange={() => setShowInactive(!showInactive)} color="primary" />}
      label={'הצג הפקדות פעילות'}
    />}<Typography variant="h6" align="center" sx={{ mt: 4 }}>No deposits available</Typography>
    </Box>
  }

  return (

    <Box sx={{ p: 2 }}>
      {!state?.loans && <FormControlLabel
        control={<Checkbox checked={showInactive} onChange={() => setShowInactive(!showInactive)} color="primary" />}
        label={'הצג הפקדות פעילות'}
      />}
      <SortFilter
        items={deposits}
        sortOrder={'default'}
        onSortChange={handleSortChange}
        sortFunctions={sortFunctions}
        sortOptions={sortOptions}
      >
        {(sortedDeposits) => (
          <>
            <ExportButton
              data={sortedDeposits.map(deposit => ({
                'Name': deposit.depositor.firstName + ' ' + deposit.depositor.lastName,
                'ID': deposit.depositor.identity,
                'Amount': deposit.amount,
                'Currency': deposit.currency,
                'Fundraiser Type': deposit.fundraiserType || 'N/A',
                'Notes': deposit.notes,
                'Status': deposit.status ? 'Active' : 'Inactive',
                'מי קיבל את הכסף': deposit.moneyRecipient !== undefined ? moneyRecipientOptionsValue[deposit.moneyRecipient] : 'אין מידע',
              }))}
              fileName={`DonationsList_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.xlsx`}
            />
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
