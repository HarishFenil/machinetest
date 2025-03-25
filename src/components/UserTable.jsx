import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, TextField, Pagination, CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);

  const sortedUsers = useMemo(() => {
    if (!sortColumn) return filteredUsers;
    return [...filteredUsers].sort((a, b) => 
      sortDirection === 'asc' 
        ? a[sortColumn].localeCompare(b[sortColumn]) 
        : b[sortColumn].localeCompare(a[sortColumn])
    );
  }, [filteredUsers, sortColumn, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return sortedUsers.slice(startIndex, startIndex + usersPerPage);
  }, [sortedUsers, currentPage]);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleSort = (column) => {
    setSortDirection(sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc');
    setSortColumn(column);
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Typography color="error" textAlign="center">Error: {error}</Typography>;

  return (
    <Box maxWidth="1200px" mx="auto" mt={5} p={3} borderRadius={4} boxShadow={3} bgcolor="background.paper">
      <TextField 
        fullWidth 
        variant="outlined" 
        label="Search users..." 
        value={searchTerm} 
        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
        sx={{ mb: 3 }}
      />
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{backgroundColor:"royalblue",color:"white"}}>
            <TableRow>
              <TableCell>
                <TableSortLabel 
                sx={{color:"white"}}
                  active={sortColumn === 'name'} 
                  direction={sortDirection} 
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel 
                   sx={{color:"white"}}
                  active={sortColumn === 'email'} 
                  direction={sortDirection} 
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{color:"white"}}>Phone</TableCell>
              <TableCell sx={{color:"white"}}>Company</TableCell>
              <TableCell sx={{color:"white"}}>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.company.name}</TableCell>
                <TableCell>{`${user.address.city}, ${user.address.street}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}