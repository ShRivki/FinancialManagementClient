import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography, Grid } from '@mui/material';
import UserAddEdit from '../User/userAddEdit';
import AddDonation from '../Donation/addDonation';
import AddDeposit from '../Deposit/addDeposit';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
const ROUTES = {
    HOME: '/HomePage',
    USER_LIST: '/UserList',
    LOG_IN: '/',
    LOG_OUT: '/LogOut',
    DEPOSIT: '/DepositsList',
    DONATION: '/DonationsList',
    LOAN: '/LoansList',
    ADD_LOAN: '/loanAddEdit' 
};

const Header = () => {
    const navigate = useNavigate();
    const [dialogState, setDialogState] = useState({
        userDialogOpen: false,
        donationDialogOpen: false,
        depositDialogOpen: false,
    });

    const handleDialogToggle = (dialogName) => {
        setDialogState(prevState => ({
            ...prevState,
            [dialogName]: !prevState[dialogName]
        }));
    };

    const renderButton = (variant, color, onClick, text) => (
        <Grid item>
            <Button
                variant={variant}
                sx={{ 
                    bgcolor: color, 
                    color: '#fff', 
                    '&:hover': { bgcolor: variant === 'contained' ? color + 'CC' : color + '80' } 
                }}
                onClick={onClick}
            >
                {text}
            </Button>
        </Grid>
    );

    const renderOutlinedButton = (onClick, text) => (
        <Grid item>
            <Button
                variant="outlined"
                sx={{ 
                    borderColor: '#004d40', 
                    color: '#004d40', 
                    '&:hover': { borderColor: '#00332e', color: '#00332e' } 
                }}
                onClick={onClick}
            >
                {text}
            </Button>
        </Grid>
    );

    const renderDialog = (dialogName, title, ContentComponent) => (
        <Dialog open={dialogState[dialogName]} onClose={() => handleDialogToggle(dialogName)}>
            <DialogTitle sx={{ bgcolor: '#004d40', color: '#fff' }}>{title}</DialogTitle>
            <DialogContent>
                <ContentComponent open={dialogState[dialogName]} handleClose={() => handleDialogToggle(dialogName)} />
            </DialogContent>
        </Dialog>
    );

    return (
        <Box sx={{ p: 3, bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#004d40' }}>ניהול כספים חכם</Typography>
            <Grid container spacing={2} justifyContent="center">
            {renderButton('contained', '#004d40', () => navigate(ROUTES.HOME), <HomeIcon />)}
            {renderButton('contained', '#00796b', () => navigate(ROUTES.LOG_IN), <LoginIcon />)}
                {/* {renderButton('contained', '#004d40', () => navigate(ROUTES.HOME), 'Home-בית')}
                {renderButton('contained', '#00796b', () => navigate(ROUTES.LOG_IN), 'LogIn/LogOut-כניסה/יציאה')} */}
                {renderOutlinedButton(() => handleDialogToggle('depositDialogOpen'), 'הוספת הפקדה')}
                {renderOutlinedButton(() => navigate(ROUTES.ADD_LOAN), 'הוספת הלוואה')}
                {renderOutlinedButton(() => navigate(ROUTES.USER_LIST), 'Users-משתמשים')}
                {renderOutlinedButton(() => navigate(ROUTES.LOAN), 'Loan-הלוואה')}
                {renderOutlinedButton(() => navigate(ROUTES.DONATION), 'Donation-תרומות')}
                {renderOutlinedButton(() => navigate(ROUTES.DEPOSIT), 'DEPOSIT-הפקדות')}
                {renderOutlinedButton(() => handleDialogToggle('userDialogOpen'), 'הוספת משתמש')}
                {renderOutlinedButton(() => handleDialogToggle('donationDialogOpen'), 'הוספת תרומה')}
            </Grid>
            
            {/* Dialogs */}
            {renderDialog('userDialogOpen', 'הוספת משתמש', UserAddEdit)}
            {renderDialog('donationDialogOpen', 'הוספת תרומה', AddDonation)}
            {renderDialog('depositDialogOpen', 'הוספת הפקדה', AddDeposit)}
        </Box>
    );
};

export default Header;
