import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import { format } from 'date-fns';
import { repaymentDeposit } from '../Services/depositService';
import { useDispatch } from 'react-redux';

const DepositDetails = ({ deposit }) => {
    const { id, depositor, amount, notes, dateOfMaturity, status } = deposit;
    const dispatch = useDispatch();

    const renderTextSection = (label, value) => (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="#003366">{label}</Typography>
            <Typography variant="body2" sx={{ color: grey[800] }}>
                {value || 'אין מידע'}
            </Typography>
        </Box>
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
                <Typography variant="h6" sx={{ color: '#003366' }}>
                    הפקדה של: <strong>{depositor.firstName} {depositor.lastName}</strong>
                </Typography>
                <Divider sx={{ my: 2, borderColor: '#003366' }} />
                {renderTextSection('סכום הפקדה:', `${amount} ש"ח`)}
                {renderTextSection('הערות:', notes)}
                {renderTextSection('תאריך פרעון:', dateOfMaturity ? format(new Date(dateOfMaturity), 'yyyy-MM-dd') : 'אין תאריך פרעון')}
                {renderTextSection('סטטוס:', status ? 'פעיל' : 'לא פעיל')}
                <Button
                    onClick={() => dispatch(repaymentDeposit(id))}
                    variant="contained"
                    sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#FF7F50' } }}
                >
                    פרעון הפקדה
                </Button>
            </CardContent>
        </Card>
    );
};

export default DepositDetails;
