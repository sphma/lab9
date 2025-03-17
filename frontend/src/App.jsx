import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Typography, Card, CardContent } from '@mui/material';

function App() {
  const [puppies, setPuppies] = useState([]);
  const [formData, setFormData] = useState({ name: '', breed: '', age_est: '', current_kennel_number: '' });

  useEffect(() => {
    fetchPuppies();
  }, []);

  const fetchPuppies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/');
      setPuppies(response.data);
    } catch (error) {
      console.error('Error fetching puppies:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/', formData);
      fetchPuppies();
      setFormData({ name: '', breed: '', age_est: '', current_kennel_number: '' });
    } catch (error) {
      console.error('Error adding puppy:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/${id}`);
      fetchPuppies();
    } catch (error) {
      console.error('Error deleting puppy:', error);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Puppy Management</Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add New Puppy</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} required fullWidth />
            <TextField label="Breed" name="breed" value={formData.breed} onChange={handleInputChange} fullWidth />
            <TextField label="Estimated Age" name="age_est" type="number" value={formData.age_est} onChange={handleInputChange} fullWidth />
            <TextField label="Kennel Number" name="current_kennel_number" type="number" value={formData.current_kennel_number} onChange={handleInputChange} fullWidth />
            <Button type="submit" variant="contained" color="primary">Add Puppy</Button>
          </Box>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Puppies List</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Kennel Number</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {puppies.length > 0 ? (
                  puppies.map((puppy) => (
                    <TableRow key={puppy.pet_id}>
                      <TableCell>{puppy.name}</TableCell>
                      <TableCell>{puppy.breed}</TableCell>
                      <TableCell>{puppy.age_est}</TableCell>
                      <TableCell>{puppy.current_kennel_number}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(puppy.pet_id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No puppies found. Add some!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
