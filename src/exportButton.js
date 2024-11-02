import React from 'react';
import { exportToExcel } from './exportToExcel'; // שנה את נתיב הייבוא בהתאם למיקום הקובץ
import { Button } from '@mui/material';
import exportImage from './excele.webp'
const ExportButton = ({ data, fileName }) => {
  const handleExport = () => {
    exportToExcel(data, fileName);
  };

  return (
    <Button onClick={handleExport}>
      <img src={exportImage} alt="Export to Excel" style={{ width: '50px', height: '50px' }} />
    </Button>
  );
};

export default ExportButton;