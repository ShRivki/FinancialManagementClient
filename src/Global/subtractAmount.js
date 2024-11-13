import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import { subBalance } from '../Services/globalVariabelsService';
import { currencyOptions } from '../constants';

const SubtractAmount = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState(0);
    const dispatch = useDispatch();

    const handleSubtract = () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('אנא הזן סכום תקין');
            return;
        }

        const operatingExpenses = parseFloat(amount);
        dispatch(subBalance(operatingExpenses, currency));
        setAmount('');
        setCurrency(0);
    };

    return (
        <Box sx={{ mt: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField label="סכום להורדה" variant="outlined" value={amount} type='number' onChange={(event) => setAmount(event.target.value)} sx={{ flex: 2 }} />
                <FormControl sx={{ flex: 1 }}>
                    <InputLabel>בחר מטבע</InputLabel>
                    <Select
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value)}
                        label="בחר מטבע"
                    >
                        {currencyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Button variant="contained" color="primary" onClick={handleSubtract} fullWidth>
                הורדת סכום
            </Button>
        </Box>
    );
};

export default SubtractAmount;
