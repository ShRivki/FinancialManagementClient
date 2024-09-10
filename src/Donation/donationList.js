import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDonations } from '../Services/donationService';
import { useLocation } from 'react-router-dom';
import DonationDetails from './donationDetails';
import SortFilter from '../User/sortFilter';
import { Typography, Box, Divider, Grid, Paper } from '@mui/material';

const DonationsList = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const allDonations = useSelector(state => state.Donations.donations);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    if (!state?.donations) {
      dispatch(getDonations());
    }
  }, [dispatch, state]);

  const donations = state?.donations || allDonations;

  // Define your sort functions
  const sortFunctions = {
    amountAsc: (a, b) => a.amount - b.amount,
    amountDesc: (a, b) => b.amount - a.amount,
    nameAsc: (a, b) => a.donor.firstName.localeCompare(b.donor.firstName),
    nameDesc: (a, b) => b.donor.firstName.localeCompare(a.donor.firstName)
  };

  // Define your sort options
  const sortOptions = [
    { value: 'default', label: 'ברירת מחדל' },
    { value: 'amountAsc', label: 'סכום (מנמוך לגבוה)' },
    { value: 'amountDesc', label: 'סכום ( מגבוה לנמוך)' },
    { value: 'nameAsc', label: 'שם (א׳ עד ת׳)' },
    { value: 'nameDesc', label: 'שם (ת׳ עד א׳)' }
  ];

  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  return (
    <Box sx={{ p: 2 }}>
      <SortFilter
        items={donations}
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
                אין תרומות זמינות
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {sortedItems.map((donation, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <div
                      elevation={3}
                      sx={{ padding: 2, minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 2, boxShadow: 1 }}
                    >
                      <DonationDetails donation={donation} />
                    </div>
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
