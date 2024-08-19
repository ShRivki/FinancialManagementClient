import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, Grid, Avatar } from '@mui/material';
import { grey, blue, orange } from '@mui/material/colors';
import { format } from 'date-fns';
import { repaymentLoan } from '../Services/loanService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const LoanDetails = ({ loan, isFromGuarantee }) => { // הוספת isFromGuarantee כפרופס
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Loan:', loan);
    }, [loan]);

    if (!loan) {
        return <Typography variant="h6" align="center" sx={{ mt: 4, color: '#2F4F4F' }}>Loan data is missing</Typography>;
    }

    const { id, borrower, amount, loanDate, status, guarantees, currentPayment, totalPayments } = loan;

    const handleEdit = () => {
        navigate('/loanAddEdit', { state: loan });
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
                            <AccountBalanceIcon />
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h6" component="div" gutterBottom sx={{ color: '#003366' }}>
                            הלוואה של: <strong>{borrower.firstName} {borrower.lastName}</strong>
                        </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2, borderColor: '#003366' }} />
                {renderTextSection('סכום הלוואה:', `${amount} ש"ח`, { fontWeight: 'bold', color: '#003366' })}
                {renderTextSection('תאריך יצירת הלוואה:', loanDate ? format(new Date(loanDate), 'yyyy-MM-dd') : 'אין תאריך פרעון', { color: '#2F4F4F' })}
                {renderTextSection('תשלומים:', `${currentPayment}/${totalPayments}`, { color: '#2F4F4F' })}
                {renderTextSection('סטטוס:', status ? 'פעיל' : 'לא פעיל', { color: status ? '#003366' : '#2F4F4F' })}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" color="#2F4F4F">ערבים:</Typography>
                    {renderGuarantees(guarantees)}
                </Box>
                {!isFromGuarantee && ( // הצגת הכפתורים רק אם לא ניגשים דרך ערבות
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button onClick={() => dispatch(repaymentLoan(id))} variant="contained" sx={{ bgcolor: '#FF8C00', '&:hover': { bgcolor: '#FF7F50' } }}> {/* Dark Orange Button */}
                            החזר הלוואה
                        </Button>
                        <Button onClick={handleEdit} variant="outlined" sx={{ color: '#003366', borderColor: '#003366' }}> {/* Dark Blue Outline Button */}
                            ערוך הלוואה
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default LoanDetails;
