import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, Grid, IconButton, Dialog, DialogContent } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLocation } from 'react-router-dom';
import SortFilter from '../User/sortFilter';
import LoanDetails from '../Loan/loanDetails';
import {getGuaranteeAmount} from '../Services/userService'
import { currencyOptionsValue } from '../constants.js';
import {convertToILS} from '../constants.js'
import { useCurrencyRates } from '../Global/currencyRates';
const GuaranteeList = () => {
  const { state } = useLocation();
  const [sortOrder, setSortOrder] = useState('default');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0); 
  const currencyRates = useCurrencyRates();
  useEffect(() => {
    const fetchGuaranteeAmount = async () => {
      if (state?.id) {
        try {
         
          let amount = 0, loanAmount = 0, depositAmount = 0;

          state?.depositGuarantees.forEach(depositGuarantee => {
              loanAmount += convertToILS(depositGuarantee.loan.remainingAmount, depositGuarantee.loan.currency, currencyRates);
          });
          
          state?.guarantees.forEach( guarantee => {
              depositAmount +=convertToILS(guarantee.loan.remainingAmount, guarantee.loan.currency, currencyRates);
          });
          
          amount = depositAmount + loanAmount;
          
          setTotalAmount(amount);
        } catch (error) {
          console.error('Error fetching guarantee amount:', error);
        }
      }
    };
  
    fetchGuaranteeAmount();
  }, [state]);
  
  useEffect(() => {
console.log(state?.guarantees )
console.log(state?.depositGuarantees )
  }, []);
  const guarantees = [
    ...(state?.guarantees || []),
    ...(state?.depositGuarantees )
];
  // Define your sort functions
  const sortFunctions = {
    amountAsc: (a, b) => a.loan.amount - b.loan.amount,
    amountDesc: (a, b) => b.loan.amount - a.loan.amount,
    nameAsc: (a, b) => (a.loan.borrower?.firstName || '').localeCompare(b.loan.borrower?.firstName || ''),
    nameDesc: (a, b) => (b.loan.borrower?.firstName || '').localeCompare(a.loan.borrower?.firstName || ''),
  };

  // Define your sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'amountAsc', label: 'Amount (Low to High)' },
    { value: 'amountDesc', label: 'Amount (High to Low)' },
    { value: 'nameAsc', label: 'Name (A to Z)' },
    { value: 'nameDesc', label: 'Name (Z to A)' },
  ];

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLoan(null);
  };

  return (
    <Box sx={{ p: 2 }}>
         <Typography variant="h5" sx={{ mb: 2 }}>
        סך כל הערבויות שמשתמש זה ערב : {totalAmount} ש"ח
      </Typography>
      <SortFilter
        items={guarantees}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortFunctions={sortFunctions}
        sortOptions={sortOptions}
      >
        {(sortedItems) => (
          <>
            <Divider sx={{ mb: 2 }} />
            {sortedItems.length === 0 ? (
              <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No guarantees available
              </Typography>
            ) : (
              sortedItems.map((guarantee, index) => (
                <Card key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 3, p: 2 }}>
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={8}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#003366' }}>
                          Borrower: {guarantee?.loan?.borrower?.firstName} {guarantee?.loan?.borrower?.lastName}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#2F4F4F' }}>
                          Amount: {guarantee?.loan?.amount} {currencyOptionsValue[guarantee?.loan?.currency]} 
                        </Typography>
                      </Grid>
                      <Grid item xs={4} textAlign="right">
                        <IconButton onClick={() => handleViewDetails(guarantee?.loan)} color="primary">
                          <VisibilityIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}
          </>
        )}
      </SortFilter>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogContent>
          {selectedLoan && <LoanDetails loan={selectedLoan} isFromGuarantee={true} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GuaranteeList;
