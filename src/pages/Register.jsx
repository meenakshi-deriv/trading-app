import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';
import api from '../utils/api';

const currencies = ['USD', 'EUR', 'GBP', 'JPY'];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    appId: '',
    currency: '',
    password: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('https://fs191x.buildship.run/dtrader-next/user', {
        email: formData.email,
        password: formData.password,
        currency: formData.currency
      });
      
      // Store JWT token in session storage
      if (response.data.token) {
        sessionStorage.setItem('jwt_token', response.data.token);
      }

      setSuccess({
        message: 'Registration successful!',
        accountId: response.data.output.user_id,
        balance: response.data.balance
      });

      // Store account ID and currency for later use
      localStorage.setItem('accountId', response.data.output.user_id);
      localStorage.setItem('userCurrency', formData.currency);
      
      // Redirect to login after 2 seconds
      console.log(response.data);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        <Paper elevation={3} sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="App ID"
              name="appId"
              value={formData.appId}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              margin="normal"
              required
            >
              {currencies.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {success.message}
                <br />
                Account ID: {success.accountId}
                <br />
                Balance: {success.balance}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;
