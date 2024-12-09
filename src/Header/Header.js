import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography, Grid, Menu, MenuItem } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useSelector,useDispatch } from 'react-redux'
import ExportButton from '../exportButton';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserAddEdit from '../User/userAddEdit';
import AddDonation from '../Donation/addDonation';
import AddDeposit from '../Deposit/addDeposit';
import EmailSender from '../Global/emailSender';
import SubtractAmount from '../Global/subtractAmount';
import Settings from '../Global/settings';
import DateCalculation from '../Global/dateCalculation'
import HistoryRecordList from '../Global/historyRecordList'
import { logOut } from '../Services/userService';
import { useCurrencyRates } from '../Global/currencyRates';
import {convertToILS} from '../constants'
import BackupButton from '../Global/backupButton'
const ROUTES = {
    HOME: '/Home',
    USER_LIST: '/UserList',
    LOG_IN: '/',
    LOG_OUT: '/LogOut',
    DEPOSIT: '/DepositsList',
    DONATION: '/DonationsList',
    LOAN: '/LoansList',
    ADD_LOAN: '/loanAddEdit',
    URRENT_PENDING_ITEMS: '/CurrentPendingItems'
};

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [dialogState, setDialogState] = useState({
        userDialogOpen: false,
        donationDialogOpen: false,
        depositDialogOpen: false,
        sendEmailDialogOpen: false,
        withdrawAmountDialogOpen: false,
        settingsDialogOpen: false,
        dateCalculationDialogOpen: false
    });
    const currencyRates = useCurrencyRates();
    const [anchorElLoan, setAnchorElLoan] = useState(null);
    const [anchorElDeposit, setAnchorElDeposit] = useState(null);
    const [anchorElDonation, setAnchorElDonation] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const users = useSelector(state => state.User.users);
    const token = useSelector(state => state.User.token);
    const handleDialogToggle = (dialogName) => {
        setDialogState(prevState => ({
            ...prevState,
            [dialogName]: !prevState[dialogName]
        }));
    };

    const handleMenuClick = (setAnchorFn) => (event) => {
        setAnchorFn(event.currentTarget);
    };

    const handleMenuClose = (setAnchorFn) => () => {
        setAnchorFn(null);
    };
    const handleLogout = () => {
       dispatch(logOut(navigate))
        // navigate(ROUTES.LOG_IN);
    };
    const calculateDebt = (user) => {
        if (!user.loans || user.loans.length === 0) {
            return 0;
        }
        return user.loans.reduce((totalDebt, loan) => totalDebt + convertToILS(loan.remainingAmount,loan.currency,currencyRates), 0);
    };

    // להכפיל במטח
    const calculateBalance = (user) => {
        if (!user.deposits || user.deposits.length === 0) {
            return 0;
        }
        return user.deposits.reduce((totalBalance, deposit) => totalBalance + convertToILS(deposit.amount - deposit.amountRefunded,deposit.currency,currencyRates), 0);
    };


    const renderButton = (variant, color, onClick, text) => (
        <Grid item>
            <Button
                variant={variant}
                sx={{ bgcolor: color, color: '#fff', '&:hover': { bgcolor: variant === 'contained' ? color + 'CC' : color + '80' } }}
                onClick={onClick}>
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
        <Box>
            <Box sx={{ p: 3, bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#004d40' }}>ניהול כספים חכם</Typography>
                <Grid container spacing={2} justifyContent="center">
                    {renderButton('contained', '#004d40', () => navigate(ROUTES.HOME), <HomeIcon />)}
                    {!token ? renderButton('contained', '#00796b', () => navigate(ROUTES.LOG_IN), <LoginIcon />) : renderButton('contained', '#00796b', () => handleLogout(), <LogoutIcon />)}
                    {token && (<>
                        <Grid item>
                            <Button variant="outlined" onClick={handleMenuClick(setAnchorElLoan)}>הלוואות</Button>
                            <Menu anchorEl={anchorElLoan} open={Boolean(anchorElLoan)} onClose={handleMenuClose(setAnchorElLoan)} >
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElLoan)(); navigate(ROUTES.ADD_LOAN); }}>הוספת הלוואה</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElLoan)(); navigate(ROUTES.LOAN); }}>צפייה בהלוואות</MenuItem>
                            </Menu>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={handleMenuClick(setAnchorElDeposit)}>הפקדות</Button>
                            <Menu anchorEl={anchorElDeposit} open={Boolean(anchorElDeposit)} onClose={handleMenuClose(setAnchorElDeposit)}   >
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElDeposit)(); handleDialogToggle('depositDialogOpen'); }}>הוספת הפקדה</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElDeposit)(); navigate(ROUTES.DEPOSIT); }}>צפייה בהפקדות</MenuItem>
                            </Menu>
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={handleMenuClick(setAnchorElDonation)}>תרומות</Button>
                            <Menu anchorEl={anchorElDonation} open={Boolean(anchorElDonation)} onClose={handleMenuClose(setAnchorElDonation)}>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElDonation)(); handleDialogToggle('donationDialogOpen'); }}>הוספת תרומה</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorElDonation)(); navigate(ROUTES.DONATION); }}>צפייה בתרומות</MenuItem>
                            </Menu>
                        </Grid>
                        {renderOutlinedButton(() => navigate(ROUTES.USER_LIST), 'משתמשים')}
                        {renderOutlinedButton(() => navigate(ROUTES.URRENT_PENDING_ITEMS), 'פעולות לביצוע')}
                        {renderOutlinedButton(() => handleDialogToggle('userDialogOpen'), 'הוספת משתמש')}
                        <Grid item>
                            <Button variant="outlined" onClick={handleMenuClick(setAnchorEl)}>
                                <MoreVertIcon />
                            </Button>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose(setAnchorEl)}>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorEl)(); handleDialogToggle('sendEmailDialogOpen'); }}>שליחת מייל</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorEl)(); handleDialogToggle('withdrawAmountDialogOpen'); }}>הורדת סכום</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorEl)(); handleDialogToggle('dateCalculationDialogOpen'); }}>חישוב יתרה</MenuItem>
                                <MenuItem onClick={() => { handleMenuClose(setAnchorEl)(); handleDialogToggle('settingsDialogOpen'); }}>הגדרות</MenuItem>
                                <MenuItem onClick={() => {
                                    handleMenuClose(setAnchorEl)();
                                    // כאן תוכל להוסיף כל פעולה שתרצה לבצע כשמשתמש ילחץ על האפשרות הזו 
                                }}>
                                    ייצוא רשימת משתמשים לפי סכום הלוואות
                                    <ExportButton
                                        data={users.map(user => ({
                                            'מזהה משתמש': user.identity,
                                            'שם פרטי': user.firstName,
                                            'שם משפחה': user.lastName,
                                            'חוב': calculateDebt(user), // חישוב החוב
                                        }))}
                                        fileName={`UserDebtList_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.xlsx`}
                                        sx={{ fontSize: '0.8rem', padding: '5px 10px' }}/>
                                </MenuItem>

                                <MenuItem onClick={() => {
                                    handleMenuClose(setAnchorEl)();
                                    // כאן תוכל להוסיף כל פעולה שתרצה לבצע כשמשתמש ילחץ על האפשרות הזו 
                                }}>
                                    ייצוא רשימת משתמשים לפי סכום הפקדות
                                    <ExportButton
                                        data={users.map(user => ({
                                            'מזהה משתמש': user.identity,
                                            'שם פרטי': user.firstName,
                                            'שם משפחה': user.lastName,
                                            'יתרת זכות': calculateBalance(user), // חישוב יתרת הזכות
                                        }))}
                                        fileName={`UserBalanceList_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.xlsx`}
                                        style={{ width: '5px', height: '5px' }}/>
                                </MenuItem>
                            </Menu>
                        </Grid>
                        <HistoryRecordList />
                        <BackupButton/>
                    </>)}
                </Grid>

                {renderDialog('userDialogOpen', 'הוספת משתמש', UserAddEdit)}
                {renderDialog('donationDialogOpen', 'הוספת תרומה', AddDonation)}
                {renderDialog('depositDialogOpen', 'הוספת הפקדה', AddDeposit)}
                {renderDialog('sendEmailDialogOpen', 'שליחת מייל', EmailSender)}
                {renderDialog('withdrawAmountDialogOpen', 'הורדת סכום', SubtractAmount)}
                {renderDialog('settingsDialogOpen', 'הגדרות', Settings)}
                {renderDialog('dateCalculationDialogOpen', 'חישוב יתרה לפי תאריך', DateCalculation)}
            </Box>
            <Box sx={{ height: '170px' }} />
        </Box >
    );
};

export default Header;
