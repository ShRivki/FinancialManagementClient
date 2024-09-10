import * as React from 'react';
import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Box, Table, TableBody, TableContainer, TableFooter, TablePagination, TableCell, TableRow, Paper, TextField, IconButton } from '@mui/material';
import { FirstPage as FirstPageIcon, LastPage as LastPageIcon, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { getUsers } from '../Services/userService';
import UserDetails from './userDetails';

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  const theme = useTheme();
  const handlePageChange = (event, newPage) => onPageChange(event, newPage);
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={(e) => handlePageChange(e, 0)} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={(e) => handlePageChange(e, page - 1)} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={(e) => handlePageChange(e, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={(e) => handlePageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.User.users);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getUsers());
   
  }, [dispatch]);

  const highlightText = (text) => {
    if (typeof text !== 'string') return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: '#03A9F4' }}>{part}</span>) : (part)
    );
  };

  const filteredUsers = users.filter(user =>
    [user.firstName, user.lastName, user.email, user.address,user.identity].some(field =>
      (field || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    ,console.log(users)
  );
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;
  return (
    <Box sx={{ marginTop: 4, width: '85%', mx: 'auto' }}>
      <Box sx={{ mb: 2, width: '15%' }}>
        <TextField label="חיפוש לפי שם, מייל או כתובת" variant="outlined" fullWidth onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableBody>
            {(rowsPerPage > 0 ? filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): filteredUsers
            ).map((user, index) => (
              <UserDetails key={index} user={user} highlightText={highlightText} />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[3, 5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={8}
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default memo(UserList);
