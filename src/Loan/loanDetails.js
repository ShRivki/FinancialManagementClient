import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, Grid, Avatar, TextField, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { repaymentLoan } from '../Services/loanService.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { currencyOptionsValue, paymentMethodsOptionsValue } from '../constants.js';
import LoanRepaymentDateUpdate from './loanRepaymentDateUpdate.js';
import { formatCurrency } from '../constants.js';
const LoanDetails = ({ loan, isFromGuarantee }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [editDate, setEditDate] = useState(false);

    if (!loan) return <Typography variant="h6" align="center" sx={{ mt: 4, color: '#2F4F4F' }}>Loan data is missing</Typography>;

    const { id, borrower, amount, loanDate, status, guarantees, currentPayment, totalPayments, remainingAmount, monthlyRepayment, currency, paymentMethods, depositGuarantee, nextPaymentDate, frequency } = loan;

    const handleRepayment = () => {
        if (repaymentAmount <= loan.remainingAmount) {
            const amountToRepay = repaymentAmount || monthlyRepayment;
            dispatch(repaymentLoan(id, parseFloat(amountToRepay)));
            setRepaymentAmount('');
            console.log(loan)
        } else alert('סכום שגוי');
    };

    const renderTextSection = (title, value, valueStyle = {}) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="#003366" >{title}</Typography>
            <Typography variant="body2" sx={valueStyle}>{value || 'אין מידע'}</Typography>
        </Box>
    );

    const getPaymentMethodsDisplay = (methodsValue) => Object.keys(paymentMethodsOptionsValue)
        .filter(key => (methodsValue & key) !== 0)
        .map(key => paymentMethodsOptionsValue[key])
        .join(', ') || 'אין מידע';

    return (
        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3, p: 2, bgcolor: '#FFFFFF', border: '1px solid #003366', maxWidth: 600, margin: 'auto' }}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item><Avatar sx={{ bgcolor: '#003366' }}>{id}</Avatar></Grid>
                    <Grid item xs><Typography variant="h6" component="div" gutterBottom sx={{ color: '#003366' }}>הלוואה של: <strong>{borrower.firstName} {borrower.lastName}</strong></Typography></Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: '#003366' }} />
                {renderTextSection('סכום הלוואה:', `${formatCurrency(amount - remainingAmount)} / ${formatCurrency(amount)} ${currencyOptionsValue[currency]}`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('סכום תשלום הבא:', `${formatCurrency(monthlyRepayment)} ${currencyOptionsValue[currency]}`, { color: '#2F4F4F' })}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" color="#003366" sx={{ display: 'flex', alignItems: 'center' }}>
                        תאריך תשלום הבא: {nextPaymentDate ? format(new Date(nextPaymentDate), 'dd/MM/yyyy') : 'אין תאריך הבא לתשלום'}
                        {!isFromGuarantee && (
                            <IconButton onClick={() => setEditDate(!editDate)} sx={{ p: 0, ml: 1 }}>
                                {editDate ? <CloseIcon /> : <EditIcon />}
                            </IconButton>
                        )}
                    </Typography>
                </Box>
                {editDate && <LoanRepaymentDateUpdate loan={loan} />}
                {renderTextSection('סכום שנותר לתשלום:', `${formatCurrency(remainingAmount)} ${currencyOptionsValue[currency]}`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('תאריך יצירת הלוואה:', loanDate ? format(new Date(loanDate), 'dd/MM/yyyy') : 'אין תאריך פרעון', { color: '#2F4F4F' })}
                {renderTextSection('תדירות:', `${frequency}`, { color: '#2F4F4F' })}
                {renderTextSection('תשלומים:', `${currentPayment}/${totalPayments}`, { color: '#2F4F4F' })}
                {renderTextSection('סטטוס:', status ? 'פעיל' : 'לא פעיל', { color: status ? '#003366' : '#2F4F4F' })}
                {renderTextSection('שיטות תשלום:', getPaymentMethodsDisplay(paymentMethods), { color: '#2F4F4F' })}


                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="#2F4F4F">ערבים:</Typography>
                    {guarantees?.length ? guarantees.map((guarantee, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#2F4F4F' }}>
                            {guarantee.guarantor.firstName} {guarantee.guarantor.lastName} - ת.ז: {guarantee.guarantor.identity}
                        </Typography>
                    )) : <Typography variant="body2" sx={{ color: '#2F4F4F' }}>אין ערבים</Typography>}
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="#2F4F4F">הפקדות:</Typography>
                    {depositGuarantee?.length ? depositGuarantee.map((depositUser, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#2F4F4F' }}>
                            מפקיד: {depositUser.depositUser.firstName} {depositUser.depositUser.lastName}  מזהה: {depositUser.depositUser.id}
                        </Typography>
                    )) : <Typography variant="body2" sx={{ color: '#2F4F4F' }}>אין הפקדות</Typography>}
                </Box>
                {!isFromGuarantee && (
                    <Box sx={{ mb: 2 }}>
                        <TextField label={`להחזרה סכום ${currencyOptionsValue[currency]}`} type="number" value={repaymentAmount} onChange={(e) => setRepaymentAmount(e.target.value)} fullWidth sx={{ maxWidth: 200 }} disabled={!status} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button disabled={!status} onClick={handleRepayment} variant="contained" sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#FF7F50' } }}>החזר תשלום</Button>
                            <Button onClick={() => navigate('/loanAddEdit', { state: loan })} variant="outlined" sx={{ color: '#003366', borderColor: '#003366' }}>ערוך הלוואה</Button>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default LoanDetails;
