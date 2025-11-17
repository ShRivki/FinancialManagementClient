import React, { useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useDispatch } from 'react-redux';
import { transferBetweenManagers } from '../Services/globalVariabelsService';
import { currencyOptions, moneyRecipientOptionsValue } from '../constants';

const TransferAmount = ({ handleClose }) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState(0);
    const [fromManagerId, setFromManagerId] = useState(0);
    const [toManagerId, setToManagerId] = useState(1);
    const dispatch = useDispatch();

    const managerNames = {
        0: moneyRecipientOptionsValue[0], // אליהו שרייבר
        1: moneyRecipientOptionsValue[1]  // יעקב פרידמן
    };

    const handleTransfer = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert('אנא הזן סכום תקין');
            return;
        }

        if (fromManagerId === toManagerId) {
            alert('לא ניתן להעביר סכום לאותו מנהל');
            return;
        }

        const transferAmount = parseFloat(amount);
        const currencySymbol = currencyOptions.find(opt => opt.value === currency)?.label || '';
        
        // אלרט לאישור לפני ביצוע
        const userConfirmation = window.confirm(
            `האם אתה בטוח שברצונך להעביר סכום של ${transferAmount} ${currencySymbol} מ-${managerNames[fromManagerId]} ל-${managerNames[toManagerId]}?`
        );
        
        if (!userConfirmation) {
            return;
        }

        await dispatch(transferBetweenManagers(transferAmount, currency, fromManagerId, toManagerId));
        setAmount('');
        setCurrency(0);
        setFromManagerId(0);
        setToManagerId(1);
        if (handleClose) {
            handleClose();
        }
    };

    return (
        <Box sx={{ mt: 4, width: '100%', maxWidth: 600, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                <TextField 
                    label="סכום להעברה" 
                    variant="outlined" 
                    value={amount} 
                    type='number' 
                    onChange={(event) => setAmount(event.target.value)} 
                    fullWidth 
                />
                <FormControl fullWidth>
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ flex: 1, minWidth: 180 }}>
                        <InputLabel>מנהל שולח</InputLabel>
                        <Select
                            value={fromManagerId}
                            onChange={(event) => {
                                const newFromId = event.target.value;
                                setFromManagerId(newFromId);
                                // אם המנהל השולח והמנהל המקבל זהים, שנה את המקבל
                                if (newFromId === toManagerId) {
                                    setToManagerId(newFromId === 0 ? 1 : 0);
                                }
                            }}
                            label="מנהל שולח"
                        >
                            <MenuItem value={0}>{managerNames[0]}</MenuItem>
                            <MenuItem value={1}>{managerNames[1]}</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ flex: 1, minWidth: 180 }}>
                        <InputLabel>מנהל מקבל</InputLabel>
                        <Select
                            value={toManagerId}
                            onChange={(event) => {
                                const newToId = event.target.value;
                                setToManagerId(newToId);
                                // אם המנהל השולח והמנהל המקבל זהים, שנה את השולח
                                if (newToId === fromManagerId) {
                                    setFromManagerId(newToId === 0 ? 1 : 0);
                                }
                            }}
                            label="מנהל מקבל"
                        >
                            <MenuItem value={0}>{managerNames[0]}</MenuItem>
                            <MenuItem value={1}>{managerNames[1]}</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleTransfer} 
                fullWidth
                disabled={fromManagerId === toManagerId}
            >
                {fromManagerId !== undefined && toManagerId !== undefined && managerNames[fromManagerId] && managerNames[toManagerId] 
                    ? `העברת סכום: ${managerNames[toManagerId]} → ${managerNames[fromManagerId]}` 
                    : 'העברת סכום בין מנהלים'}
            </Button>
        </Box>
    );
};

export default TransferAmount;

