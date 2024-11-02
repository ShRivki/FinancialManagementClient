// ExchangeRate.js
import React from 'react';
import { Paper, Typography } from '@mui/material';
import CurrencyRates from './currencyRates';

const ExchangeRate = () => {
    return (
        <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#004d40' }}>
            </Typography>
            <CurrencyRates />
        </Paper>
    );
};

export default ExchangeRate;
