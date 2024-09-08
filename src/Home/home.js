import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import {getGlobalVariables}from '../Services/globalVariabelsService'
import { useDispatch } from 'react-redux';

const Home = () => {
    const { totalFundBalance, activeLoans, totalLoansGranted } = useSelector(state => state.GlobalVariables);

    const [displayFundBalance, setDisplayFundBalance] = useState(0);
    const [displayActiveLoans, setDisplayActiveLoans] = useState(0);
    const [displayTotalLoansGranted, setDisplayTotalLoansGranted] = useState(0);
    const dispatch = useDispatch();

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
                const currentValue = Math.floor(progress * end);
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
                            <Typography variant="h5"> ש"ח {displayFundBalance}</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>Active Loans</Typography>
                        {activeLoans === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {displayActiveLoans} </Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item>
                    <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, color: '#00796b' }}>Total Loans Granted</Typography>
                        {totalLoansGranted === 0 ? (
                            <CircularProgress />
                        ) : (
                            <Typography variant="h5"> ש"ח {displayTotalLoansGranted}</Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
