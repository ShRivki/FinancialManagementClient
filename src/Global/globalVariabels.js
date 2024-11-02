import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGlobalVariables } from '../Services/globalVariabelsService';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';

const formatNumber = (number) => {
    const fixedNumber = number.toFixed(2);
    return fixedNumber.endsWith('.00') ? fixedNumber.slice(0, -3) : fixedNumber;
};

const GlobalVariabel = () => {
    const { totalFundBalance, activeLoans, totalLoansGranted, totalFundBalanceILS, totalFundBalanceUSD, totalFundBalanceGBP, totalFundBalanceEUR } = useSelector(state => state.GlobalVariables);
    const dispatch = useDispatch();

    const [displayFundBalance, setDisplayFundBalance] = useState(0);
    const [displayActiveLoans, setDisplayActiveLoans] = useState(0);
    const [displayTotalLoansGranted, setDisplayTotalLoansGranted] = useState(0);

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
        <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#004d40', textAlign: 'center' }}>מידע גלובלי</Typography>
            <div>{totalFundBalanceILS} ₪</div>
            <div>{totalFundBalanceUSD} $</div>
            <div>{totalFundBalanceGBP} £</div>
            <div>{totalFundBalanceEUR} €</div>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>יתרת קרן</Typography>
                        {totalFundBalance === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {formatNumber(displayFundBalance)}</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>הלוואות פעילות</Typography>
                        {activeLoans === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {formatNumber(displayActiveLoans)}</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>ההלוואות שניתנו</Typography>
                        {totalLoansGranted === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {formatNumber(displayTotalLoansGranted)}</Typography>
                        )}

                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
};

export default GlobalVariabel;
