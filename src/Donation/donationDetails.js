import React from 'react';
import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import { currencyOptionsValue ,fundraiserOptionsValue, moneyRecipientOptionsValue} from '../constants.js'



const DonationDetails = ({ donation }) => {
  const { donor, amount, notes, fundraiser, currency } = donation;

  const renderTextSection = (label, value, isBold = false) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: isBold ? 'bold' : 'normal', color: grey[800] }}>
        {value || 'אין מידע'}
      </Typography>
    </Box>
  );

  return (
    <Card sx={{ mb: 2, borderRadius: 1, boxShadow: 1, width: 300, maxWidth: '100%', p: 2, bgcolor: '#FFFFFF', border: `1px solid #003366` }}>
      <CardContent sx={{ p: 1 }}>
        <Typography variant="h6" component="div" gutterBottom sx={{ color: '#003366' }}>
          תרומה של: <strong>{donor.firstName} {donor.lastName}</strong>
        </Typography>
        <Divider sx={{ mb: 1, borderColor: '#003366' }} />
        {renderTextSection('סכום התרומה:', `${amount} ${currencyOptionsValue[currency]}`, true)}
        {renderTextSection('מתרים:', fundraiserOptionsValue[fundraiser], true)}
        {renderTextSection('מי קיבל את הכסף:', donation.moneyRecipient !== undefined ? moneyRecipientOptionsValue[donation.moneyRecipient] : 'אין מידע', true)}
        {renderTextSection('הערות:', notes, false)}
      </CardContent>
    </Card>
  );
};

export default DonationDetails;
