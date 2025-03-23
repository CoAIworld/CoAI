import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  AttachMoney as AttachMoneyIcon,
  Assignment as AssignmentIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';

// Mocked transaction data - in a real app, this would come from an API
const MOCK_TRANSACTION = {
  id: '123456789',
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
  description: 'Payment for task: Develop Smart Contract for NFT Marketplace',
  transactionHash: 'solana:4xnN2...7yGTv',
  platformFee: 15,
  aiContributionFee: 30,
  createdAt: '2023-09-10T15:30:45Z',
  updatedAt: '2023-09-10T15:35:22Z',
};

const TransactionDetailsPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // In a real app, fetch the transaction from the API
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setTransaction(MOCK_TRANSACTION);
      setLoading(false);
    }, 1000);
  }, [transactionId]);
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'pending':
        return <HourglassEmptyIcon sx={{ color: 'warning.main' }} />;
      case 'failed':
        return <ErrorOutlineIcon sx={{ color: 'error.main' }} />;
      case 'cancelled':
        return <BlockIcon sx={{ color: 'text.secondary' }} />;
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
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/transactions"
            startIcon={<ArrowBackIcon />}
          >
            Back to Transactions
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!transaction) return null;
  
  // Calculate net amount after fees
  const netAmount = transaction.amount - (transaction.platformFee || 0) - (transaction.aiContributionFee || 0);
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Button 
        component={Link}
        to="/transactions"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Transactions
      </Button>
      
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Transaction Details
          </Typography>
          <Chip 
            icon={getStatusIcon(transaction.status)}
            label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            color={getStatusColor(transaction.status)}
            variant="outlined"
          />
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Summary
                </Typography>
                
                <List>
                  <ListItem divider>
                    <ListItemText 
                      primary="Transaction ID" 
                      secondary={transaction.id} 
                    />
                  </ListItem>
                  
                  <ListItem divider>
                    <ListItemText 
                      primary="Type" 
                      secondary={getTypeLabel(transaction.type)} 
                    />
                  </ListItem>
                  
                  <ListItem divider>
                    <ListItemText 
                      primary="Description" 
                      secondary={transaction.description} 
                    />
                  </ListItem>
                  
                  {transaction.task && (
                    <ListItem divider>
                      <ListItemText 
                        primary="Related Task" 
                        secondary={
                          <Link to={`/tasks/${transaction.task.id}`} style={{ textDecoration: 'none' }}>
                            <Typography color="primary">
                              {transaction.task.title}
                            </Typography>
                          </Link>
                        } 
                      />
                    </ListItem>
                  )}
                  
                  {transaction.transactionHash && (
                    <ListItem divider>
                      <ListItemText 
                        primary="Transaction Hash" 
                        secondary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              wordBreak: 'break-all',
                              fontFamily: 'monospace'
                            }}
                          >
                            {transaction.transactionHash}
                          </Typography>
                        } 
                      />
                    </ListItem>
                  )}
                  
                  <ListItem divider>
                    <ListItemText 
                      primary="Created At" 
                      secondary={formatDate(transaction.createdAt)} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={formatDate(transaction.updatedAt)} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Amount Details
                </Typography>
                
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="primary">
                    {transaction.amount} $CoAI
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <List dense>
                  {transaction.platformFee > 0 && (
                    <ListItem>
                      <ListItemText 
                        primary="Platform Fee" 
                        secondary={`${transaction.platformFee} $CoAI (${(transaction.platformFee / transaction.amount * 100).toFixed(1)}%)`}
                      />
                    </ListItem>
                  )}
                  
                  {transaction.aiContributionFee > 0 && (
                    <ListItem>
                      <ListItemText 
                        primary="AI Contribution Fee" 
                        secondary={`${transaction.aiContributionFee} $CoAI (${(transaction.aiContributionFee / transaction.amount * 100).toFixed(1)}%)`}
                      />
                    </ListItem>
                  )}
                  
                  <ListItem>
                    <ListItemText 
                      primary="Net Amount" 
                      secondary={`${netAmount} $CoAI`}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondaryTypographyProps={{ fontWeight: 'bold', color: 'success.main' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Parties
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {transaction.from.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        From: {transaction.from.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {transaction.from.walletAddress}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                    <ArrowForwardIcon />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {transaction.to.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        To: {transaction.to.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {transaction.to.walletAddress}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TransactionDetailsPage; 