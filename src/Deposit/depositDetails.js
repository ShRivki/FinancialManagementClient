import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, Grid, Avatar, TextField ,IconButton} from '@mui/material';
import { grey } from '@mui/material/colors';
import { format } from 'date-fns';
import { repaymentDeposit } from '../Services/depositService';
import { useDispatch } from 'react-redux';
import { currencyOptionsValue } from '../constants.js';
import { paymentMethodsOptionsValue, moneyRecipientOptionsValue } from '../constants.js'
import EditIcon from '@mui/icons-material/Edit';
import { formatCurrency } from '../constants.js';
import LoanRepaymentDateUpdate from '../Loan/loanRepaymentDateUpdate.js';


const DepositDetails = ({ deposit }) => {
    const { id, depositor, amount, notes, dateOfMaturity, status, amountRefunded, currency, paymentMethods } = deposit;
    const dispatch = useDispatch();
    const [repaymentAmount, setRepaymentAmount] = useState('');
    const [editDate, setEditDate] = useState(false);
    const renderTextSection = (label, value) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="#003366">{label}</Typography>
            <Typography variant="body2" sx={{ color: grey[800] }}>
                {value || 'אין מידע'}
            </Typography>
        </Box>
    );
    

    const handleRepayment = () => {
        const amountToRepay = repaymentAmount ? parseFloat(repaymentAmount) : amount - amountRefunded;
        if (amountToRepay>0&& amountToRepay <= (amount-amountRefunded))
            dispatch(repaymentDeposit(id, amountToRepay));
        else
            alert("סכום שגוי")
        setRepaymentAmount(''); // איפוס שדה הקלט לאחר שליחה
    };

    // פונקציה למיפוי של הערכים המרובים של שיטת התשלום
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
                        <Avatar sx={{ bgcolor: '#003366' }}>
                            {id}
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" sx={{ color: '#003366' }}>
                            הפקדה של: <strong>{depositor.firstName} {depositor.lastName}</strong>
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: '#003366' }} />
                {renderTextSection('סכום הפקדה:', `${formatCurrency(amountRefunded)} / ${formatCurrency(amount)} ${currencyOptionsValue[currency]}`)}
                {renderTextSection('הערות:', notes)}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#2F4F4F' }}>תאריך פרעון: {dateOfMaturity ? format(new Date(dateOfMaturity), 'dd/MM/yyyy') : 'אין תאריך פרעון'}</Typography>
                   {status&&<IconButton onClick={() => setEditDate(!editDate)}><EditIcon /></IconButton>} 
                </Box>
                {editDate && <LoanRepaymentDateUpdate deposit={deposit} />}
                {renderTextSection('סטטוס:', status ? 'פעיל' : 'לא פעיל')}
                {renderTextSection('שיטות תשלום:', getPaymentMethodsDisplay(paymentMethods))}
                {renderTextSection('מי קיבל את הכסף:', deposit.moneyRecipient !== undefined ? moneyRecipientOptionsValue[deposit.moneyRecipient] : 'אין מידע')}
                <Box sx={{ mt: 2 }}>
                    <TextField label="סכום להחזרה" type="number" value={repaymentAmount} onChange={(e) => setRepaymentAmount(e.target.value)} variant="outlined" fullWidth sx={{ maxWidth: 200 }} disabled={!status} />
                    <Button onClick={handleRepayment} variant="contained" sx={{ mt: 2, bgcolor: '#FF8C00', '&:hover': { bgcolor: '#FF7F50' } }} disabled={!status}>
                        פרעון הפקדה
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DepositDetails;
