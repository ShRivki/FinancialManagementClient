import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import UserAddEdit from './userAddEdit';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import Tooltip from '@mui/material/Tooltip';

const UserDetails = ({ user, highlightText }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createTableCell = (key) => (
    <TableCell align="right">
      {key === 'isReliable' && !user[key] ? (
        <Tooltip title="משתמש לא אמין">
          <WarningIcon color="warning" />
        </Tooltip>
      ) : (
        highlightText(user[key] || '')
      )}
    </TableCell>
  );

  return (
    <>
      <TableRow>
        {createTableCell('firstName')}
        {createTableCell('lastName')}
        {createTableCell('identity')}
        {createTableCell('email')}
        {createTableCell('phone')}
        {createTableCell('phone2')}
        {createTableCell('address')}
        {createTableCell('isReliable')}
        <TableCell align="right">
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => navigate('/DonationsList', { state: user })} size="small" variant="outlined">תרומות</Button>
            <Button onClick={() => navigate('/LoansList', { state: user })} size="small" variant="outlined">הלוואות</Button>
            <Button onClick={() => navigate('/DepositsList', { state: user })} size="small" variant="outlined">הפקדות</Button>
            <Button onClick={() => navigate('/GuaranteeList', { state: user })} size="small" variant="outlined">ערבויות</Button>
            <Button onClick={handleEditClick} size="small" variant="outlined">עריכה</Button>
          </Box>
        </TableCell>
      </TableRow>
      <UserAddEdit open={open} handleClose={handleClose} initialValues={user} />
    </>
  );
};

export default UserDetails;
