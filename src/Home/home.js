import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, CircularProgress, Button, TextField } from '@mui/material';
import { getGlobalVariables, subBalance } from '../Services/globalVariabelsService';
import { useDispatch } from 'react-redux';

const formatNumber = (number) => {
    // עיגול ל-2 מקומות עשרוניים
    const fixedNumber = number.toFixed(2);

    // אם מספר לא כולל ערכים עשרוניים, הסר את .00
    return fixedNumber.endsWith('.00') ? fixedNumber.slice(0, -3) : fixedNumber;
};

const Home = () => {
    const { totalFundBalance, activeLoans, totalLoansGranted } = useSelector(state => state.GlobalVariables);

    const [displayFundBalance, setDisplayFundBalance] = useState(0);
    const [displayActiveLoans, setDisplayActiveLoans] = useState(0);
    const [displayTotalLoansGranted, setDisplayTotalLoansGranted] = useState(0);
    const [amount, setAmount] = useState('');
    const dispatch = useDispatch();

    const handleSubtract = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const operatingExpenses = parseFloat(amount); // המרה למספר עשרוני
        dispatch(subBalance(operatingExpenses)); // שלח לשרת
        setAmount('');
    };

    useEffect(() => {
        dispatch(getGlobalVariables());
    }, [dispatch]);

    useEffect(() => {
        const animateValue = (setter, value) => {
            let start = 0;
            const end = value;
            const duration = 3000; // זמן האנימציה ב milliseconds
            const startTime = performance.now();

            const step = (timestamp) => {
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const currentValue = Math.floor(progress * end * 100) / 100; // עיגול לשני מקומות עשרוניים
                setter(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        animateValue(setDisplayFundBalance, totalFundBalance);
        animateValue(setDisplayActiveLoans, activeLoans);
        animateValue(setDisplayTotalLoansGranted, totalLoansGranted);
    }, [totalFundBalance, activeLoans, totalLoansGranted]);

    return (
        <Box sx={{ p: 3, bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#004d40' }}>דף הבית</Typography>
            <Grid container spacing={4} justifyContent="center">
                <Grid item>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>Total Fund Balance</Typography>
                        {totalFundBalance === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {formatNumber(displayFundBalance)}</Typography> // הצגה עם שני מקומות עשרוניים רק אם יש צורך
                        )}
                    </Box>
                </Grid>
                <Grid item>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>Active Loans</Typography>
                        {activeLoans === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {formatNumber(displayActiveLoans)}</Typography> // הצגה עם שני מקומות עשרוניים רק אם יש צורך
                        )}
                    </Box>
                </Grid>
                <Grid item>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>Total Loans Granted</Typography>
                        {totalLoansGranted === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {formatNumber(displayTotalLoansGranted)}</Typography> // הצגה עם שני מקומות עשרוניים רק אם יש צורך
                        )}
                    </Box>
                </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
                <TextField
                    label="Amount to Deduct"
                    variant="outlined"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSubtract}>
                    Deduct Amount
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
