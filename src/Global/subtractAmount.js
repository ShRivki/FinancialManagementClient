// SubtractAmount.js
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { subBalance } from '../Services/globalVariabelsService';

const SubtractAmount = () => {
    const [amount, setAmount] = useState('');
    const dispatch = useDispatch();

    const handleSubtract = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('אנא הזן סכום תקין');
            return;
        }

        const operatingExpenses = parseFloat(amount);
        dispatch(subBalance(operatingExpenses));
        setAmount('');
    };

    return (
        <Box sx={{ mt: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <TextField
                label="סכום להורדה"
                variant="outlined"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                sx={{ mb: 2 }}
                fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleSubtract} fullWidth>
                הורדת סכום
            </Button>
        </Box>
    );
};

export default SubtractAmount;
