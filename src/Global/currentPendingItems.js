import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Grid, Divider } from '@mui/material';
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
    const formatDateKey = (date) => {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    };
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getDeposits());
            await dispatch(getLoans());
        };

        fetchData();
    }, []);
    useEffect(() => {
        const today = new Date();
        const tenDaysAhead = new Date();
        tenDaysAhead.setDate(today.getDate() + 10);
        const deposits = allDeposits.filter(deposit => deposit.status).filter(deposit => new Date(deposit.dateOfMaturity) <= tenDaysAhead)
            .sort((a, b) => new Date(a.dateOfMaturity) - new Date(b.dateOfMaturity)).reduce((acc, deposit) => {
                const dateKey = formatDateKey(deposit.dateOfMaturity)
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(deposit);
                return acc;
            }, {});
        setFilteredDeposits(deposits);

        // Filter loans
        const loans = allLoans
            .filter(loan => loan.status) // Active loans only
            .filter(loan => new Date(loan.nextPaymentDate) <= tenDaysAhead).sort((a, b) => new Date(a.nextPaymentDate) - new Date(b.nextPaymentDate))
            .reduce((acc, loan) => {
                const dateKey = formatDateKey(loan.nextPaymentDate)
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(loan);
                return acc;
            }, {});

        setFilteredLoans(loans);

        setLoading(false);
    }, [allDeposits, allLoans]);

    if (loading) {
        return <CircularProgress />;
    }
    const renderItemsByDate = (itemsByDate, ItemComponent, type) => {
        return Object.keys(itemsByDate).map(dateKey => (
            <Box key={dateKey} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: '#003366', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', '&::before': { content: '""', position: 'absolute', width: '40%', height: '1px', backgroundColor: '#003366', left: 0 }, '&::after': { content: '""', position: 'absolute', width: '40%', height: '1px', backgroundColor: '#003366', right: 0 } }}>{displayDate(dateKey)}</Typography>
                <Divider sx={{ mb: 2 }} />
                {itemsByDate[dateKey].map((item, index) => (
                    <ItemComponent key={index}      {...(type === 'loan' ? { loan: item } : { deposit: item })} />
                ))}
            </Box>
        ));
    };
    const displayDate = (dateString) => {
        return dateString; // מחזיר את המחרוזת המקורית ללא שינוי
    };
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
                    {Object.keys(filteredDeposits).length > 0 ? (
                        renderItemsByDate(filteredDeposits, DepositDetails, 'deposit')
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
                    {Object.keys(filteredLoans).length > 0 ? (
                        renderItemsByDate(filteredLoans, LoanDetails, 'loan')
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
