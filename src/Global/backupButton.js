import React from "react";
import { Button } from "@mui/material";
import BackupIcon from "@mui/icons-material/Backup"; // ייבוא של האייקון
import { BASIC_URL } from "../constants";

const BackupButton = () => {
  const handleBackup = async () => {
    try {
      const response = await fetch(`${BASIC_URL}/GlobalVariables/backup`, {
        method: "POST",
      });
      if (response.ok) {
        alert("Backup completed successfully!");
      } else {
        alert("Failed to complete backup.");
      }
    } catch (error) {
      console.error("Error during backup:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <Button
        variant="contained" // או "outlined" לפי הצורך
        startIcon={<BackupIcon />} // הוספת האייקון בהתחלה של הכפתור
        onClick={handleBackup}
      >
        Backup Database
      </Button>
    </div>
  );
};

export default BackupButton;
