import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, Grid, Avatar, TextField } from '@mui/material';
import { grey } from '@mui/material/colors';
import { format } from 'date-fns';
import { repaymentLoan } from '../Services/loanService.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { currencyOptionsValue, paymentMethodsOptionsValue } from '../constants.js';

const LoanDetails = ({ loan, isFromGuarantee }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [repaymentAmount, setRepaymentAmount] = useState('');

    if (!loan) {
        return <Typography variant="h6" align="center" sx={{ mt: 4, color: '#2F4F4F' }}>Loan data is missing</Typography>;
    }

    const { id, borrower, amount, loanDate, status, guarantees, currentPayment, totalPayments, remainingAmount, monthlyRepayment, currency, paymentMethods, depositGuarantee } = loan;

    const handleEdit = () => {
        navigate('/loanAddEdit', { state: loan });
    };

    const handleRepayment = () => {
        if (repaymentAmount>0&&repaymentAmount <= loan.remainingAmount) {
            const amountToRepay = repaymentAmount ? parseFloat(repaymentAmount) : monthlyRepayment;
            dispatch(repaymentLoan(id, amountToRepay));
            setRepaymentAmount(''); // Clear input field after submission
        }
        else {
            alert('סכום שגוי:(')
        }
    };

    const renderTextSection = (title, value, valueStyle = {}) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="#2F4F4F">{title}</Typography>
            <Typography variant="body2" sx={valueStyle}>{value || 'אין מידע'}</Typography>
        </Box>
    );

    // Function to get payment methods display
    const getPaymentMethodsDisplay = (methodsValue) => {
        const selectedMethods = Object.keys(paymentMethodsOptionsValue)
            .filter(key => (methodsValue & key) !== 0)
            .map(key => paymentMethodsOptionsValue[key]);
        return selectedMethods.length > 0 ? selectedMethods.join(', ') : 'אין מידע';
    };

    return (
        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3, p: 2, bgcolor: '#FFFFFF', border: '1px solid #003366', maxWidth: 600, margin: 'auto' }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar sx={{ bgcolor: '#003366' }}>{id}</Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" component="div" gutterBottom sx={{ color: '#003366' }}>
                            הלוואה של: <strong>{borrower.firstName} {borrower.lastName}</strong>
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: '#003366' }} />
                {renderTextSection('סכום הלוואה:', `${amount - remainingAmount} / ${amount} ${currencyOptionsValue[currency]}`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('סכום שנותר לתשלום:', `${remainingAmount} ${currencyOptionsValue[currency]}`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('תאריך יצירת הלוואה:', loanDate ? format(new Date(loanDate), 'yyyy-MM-dd') : 'אין תאריך פרעון', { color: '#2F4F4F' })}
                {renderTextSection('תשלומים:', `${currentPayment}/${totalPayments}`, { color: '#2F4F4F' })}
                {renderTextSection('סטטוס:', status ? 'פעיל' : 'לא פעיל', { color: status ? '#003366' : '#2F4F4F' })}
                {renderTextSection('שיטות תשלום:', getPaymentMethodsDisplay(paymentMethods), { color: '#2F4F4F' })}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="#2F4F4F">ערבים:</Typography>
                    {guarantees && guarantees.length > 0 ? (
                        guarantees.map((guarantee, index) => (
                            <Typography key={index} variant="body2" sx={{ color: '#2F4F4F' }}>
                                {guarantee.guarantor.firstName} {guarantee.guarantor.lastName} - ת.ז: {guarantee.guarantor.identity}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ color: '#2F4F4F' }}>אין ערבים</Typography>
                    )}
                </Box>
                {/* הפקדות */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="#2F4F4F">הפקדות:</Typography>
                    {depositGuarantee && depositGuarantee.length > 0 ? (
                        depositGuarantee.map((depositUser, index) => (
                            <Typography key={index} variant="body2" sx={{ color: '#2F4F4F' }}>
                                מפקיד: {depositUser.depositUser.firstName} {depositUser.depositUser.lastName} - מזהה הפקדה: {depositUser.depositUser.id}
                            </Typography>
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ color: '#2F4F4F' }}>אין הפקדות</Typography>
                    )}
                </Box>
                {!isFromGuarantee && (
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label={`להחזרה סכום ${currencyOptionsValue[currency]}`}
                            type="number"
                            value={repaymentAmount}
                            onChange={(e) => setRepaymentAmount(e.target.value)}
                            variant="outlined"
                            fullWidth
                            sx={{ maxWidth: 200 }}
                            disabled={!status}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button disabled={!status} onClick={handleRepayment} variant="contained" sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#FF7F50' } }}>
                                החזר תשלום
                            </Button>
                            <Button onClick={handleEdit} variant="outlined" sx={{ color: '#003366', borderColor: '#003366' }}>
                                ערוך הלוואה
                            </Button>
                        </Box>
                    </Box>
                )}


            </CardContent>
        </Card>
    );
};

export default LoanDetails;
