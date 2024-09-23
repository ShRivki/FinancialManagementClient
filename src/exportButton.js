import React from 'react';
import { exportToExcel } from './exportToExcel'; // שנה את נתיב הייבוא בהתאם למיקום הקובץ
import { Button } from '@mui/material';
const ExportButton = ({ data, fileName }) => {
  const handleExport = () => {
    exportToExcel(data, fileName);
  };

  return (
    <Button onClick={handleExport}>
      Export to Excel
    </Button>
  );
};

export default ExportButton;