import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import DepositDetails from '../Deposit/depositDetails'
import LoanDetails from '../Loan/loanDetails'; // נניח שיש קומפוננטה להלוואות
import { getDepositsByDate } from '../Services/depositService';
import{getLoansByDate}from '../Services/loanService'

const CurrentPendingItems = () => {
    const [deposits, setDeposits] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                
                const [depositResponse, loanResponse] = await Promise.all([
                    getDepositsByDate(today),
                    getLoansByDate(today)
                ]);
                
                setDeposits(depositResponse);
                setLoans(loanResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, color: '#003366', textAlign: 'center' }}>
                פעולות דחופות לביצוע 
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ mb: 2, color: '#003366', textAlign: 'center' }}>
                        הפקדות
                    </Typography>
                    {deposits.length > 0 ? (
                        deposits.map((deposit) => (
                            <DepositDetails key={deposit.id} deposit={deposit} />
                        ))
                    ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                            אין הפקדות להצגה
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ mb: 2, color: '#003366', textAlign: 'center' }}>
                        הלוואות
                    </Typography>
                    {loans.length > 0 ? (
                        loans.map((loan) => (
                            <LoanDetails key={loan.id} loan={loan} />
                        ))
                    ) : (
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                            אין הלוואות להצגה
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default CurrentPendingItems;
