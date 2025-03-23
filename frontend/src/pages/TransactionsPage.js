import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mocked transactions data - in a real app, this would come from an API
const MOCK_TRANSACTIONS = [
  {
    id: 't1',
    from: {
      id: 1,
      name: 'Sarah Chen',
      walletAddress: '3xGu7...',
    },
    to: {
      id: 2,
      name: 'Michael Rodriguez',
      walletAddress: '5qWt2...',
    },
    amount: 300,
    task: {
      id: 2,
      title: 'Develop Smart Contract for NFT Marketplace',
    },
    type: 'escrow_release',
    status: 'completed',
    createdAt: '2023-09-10T15:30:45Z',
  },
  {
    id: 't2',
    from: {
      id: 1,
      name: 'Sarah Chen',
      walletAddress: '3xGu7...',
    },
    to: {
      id: 1,
      name: 'Sarah Chen',
      walletAddress: '3xGu7...',
    },
    amount: 300,
    task: {
      id: 2,
      title: 'Develop Smart Contract for NFT Marketplace',
    },
    type: 'escrow_deposit',
    status: 'completed',
    createdAt: '2023-09-09T12:15:22Z',
  },
  {
    id: 't3',
    from: {
      id: 3,
      name: 'Elena Kowalski',
      walletAddress: '9pRv7...',
    },
    to: {
      id: 1,
      name: 'Sarah Chen',
      walletAddress: '3xGu7...',
    },
    amount: 250,
    task: {
      id: 1,
      title: 'Design UI/UX for DeFi Application',
    },
    type: 'task_payment',
    status: 'pending',
    createdAt: '2023-09-05T09:45:11Z',
  },
  {
    id: 't4',
    from: {
      id: 4,
      name: 'James Wilson',
      walletAddress: '6tQm2...',
    },
    to: {
      id: 5,
      name: 'Aisha Patel',
      walletAddress: '2xDr7...',
    },
    amount: 180,
    task: {
      id: 3,
      title: 'Create Content for NFT Collection',
    },
    type: 'refund',
    status: 'failed',
    createdAt: '2023-08-29T14:20:33Z',
  },
  {
    id: 't5',
    from: {
      id: 1,
      name: 'Sarah Chen',
      walletAddress: '3xGu7...',
    },
    to: {
      id: 5,
      name: 'Aisha Patel',
      walletAddress: '2xDr7...',
    },
    amount: 420,
    task: {
      id: 4,
      title: 'Backend Integration for Marketplace',
    },
    type: 'task_payment',
    status: 'completed',
    createdAt: '2023-08-22T10:05:19Z',
  },
];

// Mocked user balance data
const MOCK_BALANCE = {
  available: 2500,
  pending: 250,
  totalEarnings: 3200,
  totalSpending: 1450
};

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // In a real app, fetch transactions from the API
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setFilteredTransactions(MOCK_TRANSACTIONS);
      setBalance(MOCK_BALANCE);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        transaction => 
          transaction.task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.from.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.to.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    
    setFilteredTransactions(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, typeFilter, statusFilter, transactions]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />;
      case 'pending':
        return <HourglassEmptyIcon fontSize="small" sx={{ color: 'warning.main' }} />;
      case 'failed':
        return <ErrorOutlineIcon fontSize="small" sx={{ color: 'error.main' }} />;
      case 'cancelled':
        return <BlockIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'task_payment':
        return 'Task Payment';
      case 'escrow_deposit':
        return 'Escrow Deposit';
      case 'escrow_release':
        return 'Escrow Release';
      case 'refund':
        return 'Refund';
      case 'platform_fee':
        return 'Platform Fee';
      case 'reward':
        return 'Reward';
      default:
        return 'Other';
    }
  };
  
  const getArrowIcon = (transaction, currentUserWallet) => {
    const isOutgoing = transaction.from.walletAddress === currentUserWallet;
    return isOutgoing ? 
      <ArrowUpwardIcon fontSize="small" color="error" /> : 
      <ArrowDownwardIcon fontSize="small" color="success" />;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (!connected) {
    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Alert 
          severity="info" 
          sx={{ mt: 4 }}
          action={<WalletMultiButton />}
        >
          Please connect your wallet to view your transactions.
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your transaction history
        </Typography>
      </Box>
      
      {balance && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Available Balance
                  </Typography>
                  <AccountBalanceIcon color="primary" />
                </Box>
                <Typography variant="h4" component="div">
                  {balance.available} $CoAI
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <HourglassEmptyIcon color="warning" />
                </Box>
                <Typography variant="h4" component="div">
                  {balance.pending} $CoAI
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Earned
                  </Typography>
                  <ArrowDownwardIcon color="success" />
                </Box>
                <Typography variant="h4" component="div" color="success.main">
                  {balance.totalEarnings} $CoAI
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Total Spent
                  </Typography>
                  <ArrowUpwardIcon color="error" />
                </Box>
                <Typography variant="h4" component="div" color="error.main">
                  {balance.totalSpending} $CoAI
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Transaction Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="task_payment">Task Payment</MenuItem>
                  <MenuItem value="escrow_deposit">Escrow Deposit</MenuItem>
                  <MenuItem value="escrow_release">Escrow Release</MenuItem>
                  <MenuItem value="refund">Refund</MenuItem>
                  <MenuItem value="platform_fee">Platform Fee</MenuItem>
                  <MenuItem value="reward">Reward</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>From/To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No transactions found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => {
                    // Assuming the current user wallet is the first mock transaction's wallet address for demo
                    const currentUserWallet = MOCK_TRANSACTIONS[0].from.walletAddress;
                    const isOutgoing = transaction.from.walletAddress === currentUserWallet;
                    const counterparty = isOutgoing ? transaction.to : transaction.from;
                    
                    return (
                      <TableRow 
                        key={transaction.id}
                        hover
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getTypeLabel(transaction.type)} 
                            size="small" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getArrowIcon(transaction, currentUserWallet)}
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                ml: 1,
                                color: isOutgoing ? 'error.main' : 'success.main',
                                fontWeight: 'bold'
                              }}
                            >
                              {isOutgoing ? '-' : '+'}{transaction.amount} $CoAI
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {isOutgoing ? 'To: ' : 'From: '}{counterparty.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {counterparty.walletAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(transaction.status)}
                            label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            size="small"
                            color={getStatusColor(transaction.status)}
                          />
                        </TableCell>
                        <TableCell>
                          <Link to={`/tasks/${transaction.task.id}`} 
                            onClick={(e) => e.stopPropagation()}
                            style={{ textDecoration: 'none' }}
                          >
                            <Typography variant="body2" color="primary">
                              {transaction.task.title.length > 25 
                                ? transaction.task.title.substring(0, 25) + '...' 
                                : transaction.task.title}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/transactions/${transaction.id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default TransactionsPage; 