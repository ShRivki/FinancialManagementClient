import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, Grid, Avatar, TextField } from '@mui/material';
import { grey, blue, orange } from '@mui/material/colors';
import { format } from 'date-fns';
import { repaymentLoan } from '../Services/loanService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { currencyOptionsValue } from '../constants.js'
const LoanDetails = ({ loan, isFromGuarantee }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [repaymentAmount, setRepaymentAmount] = useState('');

    if (!loan) {
        return <Typography variant="h6" align="center" sx={{ mt: 4, color: '#2F4F4F' }}>Loan data is missing</Typography>;
    }

    const { id, borrower, amount, loanDate, status, guarantees, currentPayment, totalPayments, remainingAmount, monthlyRepayment ,currency} = loan;

    const handleEdit = () => {
        navigate('/loanAddEdit', { state: loan });
    };

    const handleRepayment = () => {
        // Send repayment amount or default to monthlyRepayment
        const amountToRepay = repaymentAmount ? parseFloat(repaymentAmount) : monthlyRepayment;
        dispatch(repaymentLoan(id, amountToRepay));
        setRepaymentAmount(''); // Clear the input field after submission
    };

    // Helper function for rendering text sections
    const renderTextSection = (title, value, valueStyle = {}) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="#2F4F4F">{title}</Typography>
            <Typography variant="body2" sx={valueStyle}>{value}</Typography>
        </Box>
    );

    // Helper function for rendering guarantees
    const renderGuarantees = (guarantees) => (
        guarantees.length > 0 ? (
            guarantees.map((guarantee, index) => (
                <Typography key={index} variant="body2" sx={{ color: '#2F4F4F' }}>
                    מזהה ערב: {guarantee.guarantor.firstName} {guarantee.guarantor.lastName}
                </Typography>
            ))
        ) : (
            <Typography variant="body2" sx={{ color: '#2F4F4F' }}>אין ערבים</Typography>
        )
    );

    return (
        <Card sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            bgcolor: '#FFFFFF', // White Background
            border: `1px solid #003366`, // Dark Blue Border
            maxWidth: 600,
            margin: 'auto'
        }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar sx={{ bgcolor: '#003366' }}> {/* Dark Blue */}
                            {/* <AccountBalanceIcon /> */}
                            {id}
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" component="div" gutterBottom sx={{ color: '#003366' }}>
                            הלוואה של: <strong>{borrower.firstName} {borrower.lastName}</strong>
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: '#003366' }} />
                {renderTextSection('סכום הלוואה:', ` ${amount-remainingAmount} / ${amount}  ${currencyOptionsValue[currency]}`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('סכום שנותר לתשלום:', `${remainingAmount} ${currencyOptionsValue[currency]}`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('תאריך יצירת הלוואה:', loanDate ? format(new Date(loanDate), 'yyyy-MM-dd') : 'אין תאריך פרעון', { color: '#2F4F4F' })}
                {renderTextSection('תשלומים:', `${currentPayment}/${totalPayments}`, { color: '#2F4F4F' })}
                {renderTextSection('סטטוס:', status ? 'פעיל' : 'לא פעיל', { color: status ? '#003366' : '#2F4F4F' })}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="#2F4F4F">ערבים:</Typography>
                    {renderGuarantees(guarantees)}
                </Box>
                {!isFromGuarantee && ( // הצגת הכפתורים רק אם לא ניגשים דרך ערבות
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label={`להחזרה סכום ${currencyOptionsValue[currency]}`}
                            type="number"
                            value={repaymentAmount}
                            onChange={(e) => setRepaymentAmount(e.target.value)}
                            variant="outlined"
                            fullWidth
                            sx={{ maxWidth: 200 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button disabled={!status} onClick={handleRepayment} variant="contained" sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#FF7F50' } }}> {/* Dark Orange Button */}
                                החזר תשלום
                            </Button>
                            <Button onClick={handleEdit} variant="outlined" sx={{ color: '#003366', borderColor: '#003366' }}> {/* Dark Blue Outline Button */}
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
