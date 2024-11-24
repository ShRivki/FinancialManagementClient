import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, IconButton, Typography, Grid, Card, CardContent, Divider, Fade } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { BASIC_URL } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import ExportButton from '../exportButton';
import { getHistoryRecords } from '../Services/globalVariabelsService'
const HistoryRecordList = () => {
    // const [historyRecords, setHistoryRecords] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const dispatch = useDispatch();
    const { historyRecords } = useSelector(state => state.GlobalVariables);
    const theme = useTheme();

    useEffect(() => {

        dispatch(getHistoryRecords());

    }, [showHistory, dispatch]);
    return (
        <Box sx={{ padding: 2 }}>

            <IconButton
                onClick={() => setShowHistory(!showHistory)}
                sx={{ position: 'fixed', top: 20, left: 20, backgroundColor: theme.palette.primary.main, color: 'white', '&:hover': { backgroundColor: theme.palette.primary.dark }, boxShadow: 3, padding: 1 }}>
                <HistoryIcon />
            </IconButton>
            {showHistory && (
                <Fade in={showHistory} timeout={500}>
                    <Box
                        sx={{ width: 350, height: '80vh', overflowY: 'auto', position: 'fixed', left: 0, top: 0, zIndex: 1000, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 3, boxShadow: 6, padding: 2, border: `1px solid ${theme.palette.divider}` }}>
                        <IconButton onClick={() => setShowHistory(false)} sx={{ position: 'fixed', top: 10, left: 320, backgroundColor: 'white', '&:hover': { backgroundColor: 'lightgray' }, padding: 1, zIndex: 1100 }}>
                            <CloseIcon />
                        </IconButton>
                        <Box sx={{ position: 'fixed', top: 0, left: 260, zIndex: 1100 }}>
                            <ExportButton
                                data={historyRecords.map(item => ({
                                    'נושא': item.topic,
                                    'סוג פעולה': item.actionType,
                                    'תיאור': item.action,
                                    'תאריך': new Date(item.date).toLocaleString(),
                                }))}
                                fileName={`History_Record_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.xlsx`}
                            />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>היסטוריית פעולות</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container direction="column" spacing={2}>
                            {historyRecords.length === 0 ? (
                                <Typography variant="h6" sx={{ color: 'text.secondary' }}>לא נמצאו רשומות היסטוריה.</Typography>
                            ) : (
                                historyRecords.map(record => (
                                    <Grid item xs={12} key={record.id}>
                                        <Card sx={{ backgroundColor: theme.palette.background.paper, boxShadow: 2, borderRadius: 2 }}>
                                            <CardContent>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{record.actionType} {record.topic}</Typography>
                                                <Typography sx={{ mb: 1.5 }} color="text.secondary">{record.action}</Typography>
                                                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>{new Date(record.date).toLocaleString()}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Box>
                </Fade>
            )}
        </Box>
    );
};

export default HistoryRecordList;
