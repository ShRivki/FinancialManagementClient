import React from "react";
import { Button, Box } from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import EmailIcon from "@mui/icons-material/Email"; 
import {Backup} from '../Services/globalVariabelsService'
import { sendReminders } from '../Services/globalVariabelsService'; 

const BackupButton = () => {
  const handleBackup = async () => {
   await Backup();
  };
  const handleSendEmails = async () => {
    try {
        await sendReminders();
        alert('המיילים נשלחו בהצלחה!');
    } catch (error) {
        alert('שליחת המיילים נכשלה.');
    }
};
  return (
    <Box display="flex" gap={1} p={1} justifyContent="center">
      <Button variant="contained" color="primary" startIcon={<BackupIcon />} onClick={handleBackup} size="small">
        גיבוי נתונים
      </Button>
      <Button variant="contained" color="primary" startIcon={<EmailIcon />} onClick={handleSendEmails} size="small">
        שליחת מיילים-יומית
      </Button>
    </Box>
  );
};

export default BackupButton;
