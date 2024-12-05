import { useState } from 'react';
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
import axios from 'axios';

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
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await axios.post(
        'https://fs191x.buildship.run/dtrader-next/user',
        {
          email: formData.email,
          password: formData.password,
          currency: formData.currency
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAsImFwcF9pZCI6MTAwMCwiYWNjb3VudF9pZCI6MTMsImlhdCI6MTczMzM3NjgzMSwiZXhwIjoxNzY0OTEyODIyfQ.hmc1aUT_R75K1iyemngogSxVmRp2RIDxpYRLbdmw2aDuPN0o7V5dJ7lG_P38UJ0QStwyrVHs7H_S9m7XemKemBNGofL8mvMCaIOCjloWRURMdQae3VV5cBo5k3eBJdlgTBAMJjFwigHaf016iAEUF2NRJdvEqODTFyymlgxkhvvviIL8So5PN1LxWij9moaiuTj2ssK2od35U4UaVVaezZ7JNGEg83WquKlw7zzg2LYjbPhDuqiUVaAn5n4S68oS_0xgbA1JRdhZwwu6S84klcXm2HiyFBxRJ0zAcS178tUodbX8Teinx6BtAq4ld8S2IP69_ll5u24A0P-Lf859SQ'
          }
        }
      );
      setSuccess({
        message: 'Registration successful!',
        accountId: response.data.account_id,
        balance: response.data.balance
      });
      // Store account ID for login
      localStorage.setItem('accountId', response.data.account_id);
      // Redirect to login after 2 seconds
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
