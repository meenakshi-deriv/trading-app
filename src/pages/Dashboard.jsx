import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import api from '../utils/api';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    }
    fetchStatements();
  }, [navigate]);

  const fetchStatements = async () => {
    try {
      const response = await axios.get('https://fs191x.buildship.run/dtrader-next/statement', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDAsImFwcF9pZCI6MTAwMCwiYWNjb3VudF9pZCI6MTMsImlhdCI6MTczMzM3NjgzMSwiZXhwIjoxNzY0OTEyODIyfQ.hmc1aUT_R75K1iyemngogSxVmRp2RIDxpYRLbdmw2aDuPN0o7V5dJ7lG_P38UJ0QStwyrVHs7H_S9m7XemKemBNGofL8mvMCaIOCjloWRURMdQae3VV5cBo5k3eBJdlgTBAMJjFwigHaf016iAEUF2NRJdvEqODTFyymlgxkhvvviIL8So5PN1LxWij9moaiuTj2ssK2od35U4UaVVaezZ7JNGEg83WquKlw7zzg2LYjbPhDuqiUVaAn5n4S68oS_0xgbA1JRdhZwwu6S84klcXm2HiyFBxRJ0zAcS178tUodbX8Teinx6BtAq4ld8S2IP69_ll5u24A0P-Lf859SQ'
        }
      });
      setStatements(response.data);
    } catch (err) {
      console.error('Error fetching statements:', err);
      setError(err.response?.data?.message || 'Failed to fetch statements');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
    setAmount('');
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const currency = localStorage.getItem('currency') || 'USD';
      const response = await axios.post(
        'https://fs191x.buildship.run/dtrader-next/deposit',
        {
          amount: Number(amount),
          currency: currency
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMDAwIiwiYWNjb3VudF9pZCI6MSwiZXhwIjoxNzU2MjM5MDIyfQ.srPXudzVDKY6Z79lW6186hlpLLY4VtOCp03yhzHkNcgpv4vVYfN3Kp6iQ57US_BPIMelvLqfwOD3uPA4FoADL_zRkzBm6-1WXE4RoSEwKduyfIreJjYIwM4yGbATibx0Ag1bnoGB9lyTOKYTeST4054tZyLPSSTQ-74RkklpGB08eUIqVg5KpEj0DctQFdZ2SvFNCfErKyFP9m2NyF-hvwPaRWfd0hTGnOFP0uIDV1gAi-004RGOmpgThKntI_pz6NBDR6T8hHg76dCLSfgwjGYZ6WUemjwIXS9zCbumC3jic0iJMF6c3EYFui4JNVpXPIh-cYAIQHF73bItqLapGw'
          }
        }
      );
      setSuccess('Deposit successful!');
      fetchStatements();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing deposit');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const currency = localStorage.getItem('currency') || 'USD';
      const response = await axios.post(
        'https://fs191x.buildship.run/dtrader-next-withdraw-7782ace5e3f7',
        {
          amount: Number(amount),
          currency: currency
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiIxMDAwIiwiYWNjb3VudF9pZCI6MSwiZXhwIjoxNzU2MjM5MDIyfQ.srPXudzVDKY6Z79lW6186hlpLLY4VtOCp03yhzHkNcgpv4vVYfN3Kp6iQ57US_BPIMelvLqfwOD3uPA4FoADL_zRkzBm6-1WXE4RoSEwKduyfIreJjYIwM4yGbATibx0Ag1bnoGB9lyTOKYTeST4054tZyLPSSTQ-74RkklpGB08eUIqVg5KpEj0DctQFdZ2SvFNCfErKyFP9m2NyF-hvwPaRWfd0hTGnOFP0uIDV1gAi-004RGOmpgThKntI_pz6NBDR6T8hHg76dCLSfgwjGYZ6WUemjwIXS9zCbumC3jic0iJMF6c3EYFui4JNVpXPIh-cYAIQHF73bItqLapGw'
          }
        }
      );
      setSuccess('Withdrawal successful!');
      fetchStatements();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Trading Dashboard
        </Typography>
        <Paper elevation={3}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Deposit" />
            <Tab label="Withdraw" />
            <Tab label="Statement" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleDeposit}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                margin="normal"
                required
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Deposit'}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleWithdraw}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                margin="normal"
                required
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Withdraw'}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statements.map((statement) => (
                    <TableRow key={statement.id}>
                      <TableCell>{statement.id}</TableCell>
                      <TableCell>{statement.type}</TableCell>
                      <TableCell>{statement.amount}</TableCell>
                      <TableCell>{new Date(statement.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard;
