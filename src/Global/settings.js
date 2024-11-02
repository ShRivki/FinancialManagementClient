import React from 'react';
import { DialogContent, Typography, Button } from '@mui/material';

const Settings = ({ handleClose }) => {
    const handleSaveSettings = () => {
        // כאן אפשר להוסיף לוגיקה לשמירת הגדרות
        console.log('הגדרות נשמרו');
        handleClose();
    };

    return (
        <DialogContent>
            <Typography variant="h6">הגדרות</Typography>
            <Button onClick={handleSaveSettings}>שמור הגדרות</Button>
        </DialogContent>
    );
};

export default Settings;
