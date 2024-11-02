import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import GlobalVariabel from '../Global/globalVariabels';
import SubtractAmount from '../Global/subtractAmount';
import ExchangeRate from '../Global/exchangeRate';
import EmailSender from '../Global/emailSender'

const Home = () => {
    return (
        <Box sx={{ p: 3, bgcolor: '#e3f2fd', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 2, color: '#004d40', textAlign: 'center' }}>
                דף הבית
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <ExchangeRate />
                </Grid>
                <Grid item xs={12} md={8}>
                    <div elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
                        <GlobalVariabel />
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Home;
