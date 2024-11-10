import React, { useState, useEffect } from "react";
import { TextField, Button, Snackbar, Box } from "@mui/material";
import { updateRepaymentDate } from '../Services/loanService';
import { updateDepositDate } from '../Services/depositService';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const DateUpdate = ({ loan, deposit }) => {
  const [nextDate, setNextDate] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (loan && loan.nextPaymentDate) {
      const date = new Date(loan.nextPaymentDate);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      setNextDate(formattedDate);
    } else if (deposit && deposit.dateOfMaturity) {
      const date = new Date(deposit.dateOfMaturity);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      setNextDate(formattedDate);
    }
  }, [loan, deposit]);

  const handleDateChange = (e) => setNextDate(e.target.value);

  const handleSubmit = async () => {
    try {
      if (loan) {
        dispatch(updateRepaymentDate(loan.id, nextDate));
      } else if (deposit) {
        dispatch(updateDepositDate(deposit.id, nextDate));
      }
      ; // או המסלול המתאים להפקדה
    } catch (error) {
      alert("אירעה שגיאה בעדכון התאריך");
    } finally {
      setOpenSnackbar(true);
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField label="תאריך" type="date" value={nextDate} onChange={handleDateChange}
        InputLabelProps={{ shrink: true }} sx={{ width: 150 }} />
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ fontWeight: 'bold' }}>אישור</Button>
    </Box>
  );
};

export default DateUpdate;
