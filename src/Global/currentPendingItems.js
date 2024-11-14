import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import DepositDetails from '../Deposit/depositDetails';
import LoanDetails from '../Loan/loanDetails';
import { getLoans } from '../Services/loanService';
import { getDeposits } from '../Services/depositService';
import { useDispatch, useSelector } from 'react-redux';

const CurrentPendingItems = () => {
    const [loading, setLoading] = useState(true);
    const [filteredDeposits, setFilteredDeposits] = useState([]);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const dispatch = useDispatch();
    const allDeposits = useSelector((state) => state.Deposits.deposits);
    const allLoans = useSelector((state) => state.Loan.loans);
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getDeposits());
            await dispatch(getLoans());
        };

        fetchData();
    }, []);
    useEffect(() => {
        const today = new Date();
        const deposits = allDeposits.filter(deposit => deposit.status).filter(deposit => new Date(deposit.dateOfMaturity) <= today);
        setFilteredDeposits(deposits);

        // Filter loans
        const loans = allLoans
            .filter(loan => loan.status) // Active loans only
            .filter(loan => {
                const nextPaymentDate = new Date(loan.nextPaymentDate);
                return nextPaymentDate <= today;
            });
        setFilteredLoans(loans);

        setLoading(false);
    }, [allDeposits, allLoans]);

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
                    {filteredDeposits.length > 0 ? (
                        filteredDeposits.map((deposit, index) => (
                            <DepositDetails key={index} deposit={deposit} />
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
                    {filteredLoans.length > 0 ? (
                        filteredLoans.map((loan, index) => (
                            <LoanDetails key={index} loan={loan} />
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
