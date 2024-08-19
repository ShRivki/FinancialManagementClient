import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDonations } from '../Services/donationService';
import { useLocation } from 'react-router-dom';
import DonationDetails from './donationDetails';
import SortFilter from '../User/sortFilter';
import { Typography, Box, Divider } from '@mui/material';

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
    { value: 'default', label: 'Default' },
    { value: 'amountAsc', label: 'Amount (Low to High)' },
    { value: 'amountDesc', label: 'Amount (High to Low)' },
    { value: 'nameAsc', label: 'Name (A to Z)' },
    { value: 'nameDesc', label: 'Name (Z to A)' }
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
            {sortedItems.length === 0
              ? <Typography variant="h6" align="center" sx={{ mt: 4 }}>No donations available</Typography>
              : sortedItems.map((donation, index) => (
                  <DonationDetails key={index} donation={donation} />
                ))
            }
          </>
        )}
      </SortFilter>
    </Box>
  );
};

export default DonationsList;
