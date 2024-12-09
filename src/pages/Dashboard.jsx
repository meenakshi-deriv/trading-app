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
import axios from 'axios';

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
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    }
    fetchStatements();
    fetchBalance();
  }, [navigate]);

  const fetchBalance = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      const response = await axios.post(
        'https://fs191x.buildship.run/dtrader-next/balance',
        { account_id: accountId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6Ikd2bDBkQlBFZlRPc3o2RnciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ljZ3Vib2xwdm54dmRrb2d5dXd0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmY2U5ZGM0Mi05YTlmLTRkNDgtYjk5Ny1lNjE3ODJmYjAyNWQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMzMzAzMTU4LCJpYXQiOjE3MzMyOTk1NTgsImVtYWlsIjoibWFyaW8udmFud2VzdGVuKzdAZGVyaXYuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6Im1hcmlvLnZhbndlc3Rlbis3QGRlcml2LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJmY2U5ZGM0Mi05YTlmLTRkNDgtYjk5Ny1lNjE3ODJmYjAyNWQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTczMzI5OTU1OH1dLCJzZXNzaW9uX2lkIjoiNTk2NzcwYTUtMGFjOC00NmJmLTgxM2ItZmRjOTU2NmM3MmM3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.TC3M2UQnPayGqSLmbzZPImr9DLsdHadchy4dmUZLW5c'
          }
        }
      );
      console.log('Balance API Response:', response.data);
      setBalance(response.data.balance || 0);
    } catch (err) {
      console.log('Balance fetch error:', err);
      setBalance(0);
    }
  };

  const fetchStatements = async () => {
    try {
      const token = sessionStorage.getItem('jwt_token');
      console.log('Using JWT token:', token);
      
      const response = await axios.get('https://fs191x.buildship.run/dtrader-next/statement', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Statement API Response:', response.data);
      setStatements(response.data);
    } catch (err) {
      console.log('Statement fetch error:', err);
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
      const token = sessionStorage.getItem('jwt_token');
      const currency = localStorage.getItem('userCurrency') || 'USD';
      const response = await axios.post(
        'https://fs191x.buildship.run/dtrader-next/deposit',
        {
          amount: Number(amount),
          currency: currency
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess('Deposit successful!');
      fetchStatements();
    } catch (err) {
      console.error('Error response:', err.response?.data);
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
      const token = sessionStorage.getItem('jwt_token');
      const currency = localStorage.getItem('userCurrency') || 'USD';
      const response = await axios.post(
        'https://fs191x.buildship.run/dtrader-next/withdraw',
        {
          amount: Number(amount),
          currency: currency
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSuccess('Withdrawal successful!');
      fetchStatements();
    } catch (err) {
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Error processing withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ position: 'relative', mt: 4, mb: 4 }}>
        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
          <Typography variant="h6" component="div">
            Balance: {balance} {localStorage.getItem('userCurrency') || 'USD'}
          </Typography>
        </Box>
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
