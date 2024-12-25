import React from "react";
import { Button } from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup";
import {Backup} from '../Services/globalVariabelsService'

const BackupButton = () => {
  const handleBackup = async () => {
   await Backup();
  };

  return (
    <div>
      <Button
        variant="contained" 
        startIcon={<BackupIcon />} 
        onClick={handleBackup}
      >
       -גיבוי נתונים-
      </Button>
    </div>
  );
};

export default BackupButton;
