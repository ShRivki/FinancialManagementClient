import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDonations } from '../Services/donationService';
import { useLocation } from 'react-router-dom';
import DonationDetails from './donationDetails';
import SortFilter from '../User/sortFilter';
import { Typography, Box, Divider, Grid, Paper, Button } from '@mui/material';
import ExportButton from '../exportButton';
import { currencyOptions } from '../constants';
import { convertToILS } from '../constants';
import { useCurrencyRates } from '../Global/currencyRates';

const DonationsList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const allDonations = useSelector(state => state.Donations.donations);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    if (!state?.donations) {
      dispatch(getDonations());
    }
  }, []);

  const donations = state?.donations || allDonations;
  const currencyRates = useCurrencyRates();

  const totalAmount = donations.reduce((sum, donation) => {
    const convertedAmount = convertToILS(donation.amount, donation.currency, currencyRates);
    return sum + convertedAmount;
  }, 0);  

  // Define your sort functions
  const sortFunctions = {
    amountAsc: (a, b) => a.amount - b.amount,
    amountDesc: (a, b) => b.amount - a.amount,
    nameAsc: (a, b) => a.donor.firstName.localeCompare(b.donor.firstName),
    nameDesc: (a, b) => b.donor.firstName.localeCompare(a.donor.firstName),
  };

  // Define your sort options
  const sortOptions = [
    { value: 'default', label: 'ברירת מחדל' },
    { value: 'amountAsc', label: 'סכום (מנמוך לגבוה)' },
    { value: 'amountDesc', label: 'סכום ( מגבוה לנמוך)' },
    { value: 'nameAsc', label: 'שם (א׳ עד ת׳)' },
    { value: 'nameDesc', label: 'שם (ת׳ עד א׳)' },
  ];

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        {/* הצגת סכום התרומות */}
        <Typography variant="h6" align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          סך התרומות: {totalAmount.toLocaleString()} ₪
        </Typography>
      </Box>

      <SortFilter
        items={donations}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        sortFunctions={sortFunctions}
        sortOptions={sortOptions}
      >
        {(sortedItems) => (
          <>
            <ExportButton
              data={sortedItems.map(donation => ({
                'מזהה תרומה': donation.donor.identity,
                'שם פרטי': donation.donor.firstName,
                'שם משפחה': donation.donor.lastName,
                'סכום': donation.amount,
                'סוג': currencyOptions[donation.currency], // הוספת משתנה מטבע
                'מתרים': donation.fundraiserType || 'N/A',
                'הערות': donation.notes,
              }))}
              fileName={`DonationsList_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.xlsx`}
            />
            <Divider sx={{ mb: 2 }} />
            {sortedItems.length === 0 ? (
              <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                אין תרומות זמינות
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {sortedItems.map((donation, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper elevation={3} sx={{ padding: 2, minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius:0, boxShadow: 0}}>
                      <DonationDetails donation={donation} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </SortFilter>
    </Box>
  );
};

export default DonationsList;
