import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await api.get('https://fs191x.buildship.run/dtrader-next/statement');
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
      const currency = localStorage.getItem('userCurrency') || 'USD';
      const response = await api.post(
        'https://fs191x.buildship.run/dtrader-next/deposit',
        {
          amount: Number(amount),
          currency: currency
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
      const currency = localStorage.getItem('userCurrency') || 'USD';
      const response = await api.post(
        'https://fs191x.buildship.run/dtrader-next-withdraw-7782ace5e3f7',
        {
          amount: Number(amount),
          currency: currency
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
