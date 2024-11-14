import { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, Box, Typography, Button } from '@mui/material';

const DateCalculation = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const allLoans = useSelector((state) => state.Loan.loans);
    const allDeposits = useSelector((state) => state.Deposits.deposits);
    const { totalFundBalance ,currencyRates  } = useSelector(state => state.GlobalVariables);
    const getExchangeRate = (currency) => {
        switch (currency) {
            case 0: // ILS
                return 1;
            case 1: // USD
                return currencyRates.usdRate;
            case 2: // EUR
                return currencyRates.eurRate;
            case 3: // GBP
                return currencyRates.gbpRate;
            default:
                return 1;
        }
    };
    const calculateAmount = (date) => {
        let totalAmount = totalFundBalance;

        allDeposits.forEach((deposit) => {
            if (deposit.dateOfMaturity && new Date(deposit.dateOfMaturity) <= date) {
                const exchangeRate = getExchangeRate(deposit.currency);
                totalAmount -= (deposit.amount - deposit.amountRefunded) * exchangeRate;
            }
        });

        allLoans.forEach((loan) => {
            let CurrentPayment = 0;
            let totalAmountForLoan = 0;
            if (loan.nextPaymentDate && new Date(loan.nextPaymentDate) <= date) {
                let nextPaymentDate = new Date(loan.nextPaymentDate);
                CurrentPayment = loan.currentPayment;
                const exchangeRate = getExchangeRate(loan.currency);
                while (nextPaymentDate <= date && CurrentPayment < loan.totalPayments) {
                    totalAmountForLoan += loan.monthlyRepayment;
                    CurrentPayment++;
                    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + loan.frequency);
                }
                totalAmountForLoan=totalAmountForLoan*exchangeRate;
            }
            totalAmount += (totalAmountForLoan > loan.remainingAmount) ? loan.remainingAmount : totalAmountForLoan;
        });

        return totalAmount;
    };

    const handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        if (!isNaN(newDate.getTime())) {
            setSelectedDate(newDate);
        }
    };    
    const totalAmount = calculateAmount(selectedDate);
    return (
        <Box sx={{ p: 4, maxWidth: '600px', margin: 'auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <TextField
                label="בחר תאריך"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ mb: 3, bgcolor: '#f9f9f9', borderRadius: '4px' }}
            />
            <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
                הסכום בגמ"ח בתאריך {selectedDate.toLocaleDateString()} הוא: {totalAmount.toLocaleString()} ₪
            </Typography>
        </Box>
    );
};

export default DateCalculation;
