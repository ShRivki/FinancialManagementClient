import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Grid, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { subBalance } from '../Services/globalVariabelsService';
import CurrencyRates from '../Global/currencyRates';
import GlobalVariabel from '../Global/globalVariabels';

const Home = () => {
    const [amount, setAmount] = useState('');
    const dispatch = useDispatch();

    const handleSubtract = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('אנא הזן סכום תקין');
            return;
        }

        const operatingExpenses = parseFloat(amount); // המרה למספר עשרוני
        dispatch(subBalance(operatingExpenses)); // שלח לשרת את הבקשה להפחתת הסכום
        setAmount('');
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#004d40', textAlign: 'center' }}>
                דף הבית
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
                        <Typography variant="h6" sx={{ mb: 2, color: '#004d40' }}>
                            שער חליפין
                        </Typography>
                        <CurrencyRates />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <div elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
            
                        <GlobalVariabel />
                    </div>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
                <TextField
                    label="סכום להורדה"
                    variant="outlined"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    sx={{ mb: 2 }}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleSubtract} fullWidth>
                    הורדת סכום
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
