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
  Divider,
  Avatar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Psychology as PsychologyIcon,
  Check as CheckIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock task data (will be replaced with API calls)
const MOCK_TASK = {
  id: 2,
  title: 'Develop Smart Contract for NFT Marketplace',
  description: 'Create a Solana smart contract for a new NFT marketplace with royalty features and auction capabilities. The contract should support multiple auction types including English, Dutch, and Fixed-price auctions. It should also track royalties for original creators across secondary sales.',
  category: 'Development',
  requiredSkills: ['Solana', 'Rust', 'Smart Contracts', 'NFTs'],
  price: 300,
  deadline: '2023-10-15',
  aiAssistanceLevel: 'Medium',
  status: 'open',
  createdAt: '2023-08-18',
  creator: {
    id: 1,
    name: 'Sarah Chen',
    wallet: '3xGu7...',
    reputation: 4.8,
  },
  applications: [
    {
      id: 1,
      user: {
        id: 2,
        name: 'Michael Rodriguez',
        wallet: '5qWt2...',
        reputation: 4.5,
      },
      message: 'I have extensive experience developing NFT smart contracts on Solana. I've previously built auction contracts for major marketplaces and would love to bring my expertise to your project.',
      proposedPrice: 320,
      proposedDeadline: '2023-10-12',
    },
    {
      id: 2,
      user: {
        id: 3,
        name: 'Elena Kowalski',
        wallet: '9pRv7...',
        reputation: 4.9,
      },
      message: 'I specialize in building secure and gas-efficient Solana contracts. I've worked on several NFT projects including royalty distribution systems. Can deliver ahead of schedule with comprehensive testing.',
      proposedPrice: 280,
      proposedDeadline: '2023-10-10',
    },
  ],
  aiSuggestions: [
    'Consider implementing the Metaplex token standard for NFT compatibility',
    'Include a security feature to prevent front-running in auction bids',
    'Use a time-weighted average for price calculations to prevent manipulation',
  ],
};

const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [proposedDeadline, setProposedDeadline] = useState('');

  // In a real app, we would fetch the task data from an API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Pretend this is an API response
      if (MOCK_TASK) {
        setTask(MOCK_TASK);
        setLoading(false);
      } else {
        setError('Task not found');
        setLoading(false);
      }
    }, 1000);
  }, [taskId]);

  const handleApplyDialogOpen = () => {
    if (!connected) {
      return;
    }
    setApplyDialogOpen(true);
  };

  const handleApplyDialogClose = () => {
    setApplyDialogOpen(false);
  };

  const handleApplySubmit = () => {
    // In a real app, this would submit the application to an API
    console.log('Submitting application:', {
      taskId,
      message: applicationMessage,
      proposedPrice,
      proposedDeadline,
      wallet: publicKey?.toString(),
    });
    
    // Close dialog and show success message
    setApplyDialogOpen(false);
    alert('Application submitted successfully!');
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
            to="/tasks"
          >
            Back to Tasks
          </Button>
        </Box>
      </Container>
    );
  }

  if (!task) {
    return null;
  }

  // Check if the current user is the creator of the task
  const isCreator = connected && publicKey?.toString() === task.creator.wallet;
  // For demo purposes, always false since we don't have real wallet integration yet
  const hasApplied = false;

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mb: 4, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap' }}>
          <Box>
            <Chip 
              label={task.category} 
              color="primary" 
              size="small"
              icon={<CategoryIcon />}
              sx={{ mb: 2 }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              {task.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<AttachMoneyIcon />} 
              label={`${task.price} $CoAI`} 
              color="primary" 
              variant="outlined" 
            />
            <Chip 
              icon={<AccessTimeIcon />} 
              label={`Due: ${new Date(task.deadline).toLocaleDateString()}`} 
              color="secondary" 
              variant="outlined" 
            />
            <Chip 
              icon={<PsychologyIcon />} 
              label={`AI: ${task.aiAssistanceLevel}`} 
              color="info" 
              variant="outlined" 
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Required Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {task.requiredSkills.map((skill) => (
                <Chip 
                  key={skill} 
                  label={skill} 
                />
              ))}
            </Box>
            
            {task.aiSuggestions.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  AI Suggestions
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ p: 2, bgcolor: 'background.paper', borderColor: 'primary.light' }}
                >
                  <List dense>
                    {task.aiSuggestions.map((suggestion, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <PsychologyIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={suggestion} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Task Creator
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {task.creator.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    {task.creator.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={task.creator.reputation} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({task.creator.reputation})
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Created on {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
            
            <Box sx={{ mb: 3 }}>
              {!connected ? (
                <Alert 
                  severity="info" 
                  action={<WalletMultiButton />}
                >
                  Connect your wallet to apply for this task
                </Alert>
              ) : isCreator ? (
                <Alert severity="info">
                  You created this task
                </Alert>
              ) : hasApplied ? (
                <Alert 
                  severity="success"
                  icon={<CheckIcon fontSize="inherit" />}
                >
                  You have applied to this task
                </Alert>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleApplyDialogOpen}
                  endIcon={<SendIcon />}
                >
                  Apply for this Task
                </Button>
              )}
            </Box>
            
            {task.applications && task.applications.length > 0 && isCreator && (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Applications ({task.applications.length})
                </Typography>
                <List disablePadding>
                  {task.applications.map((app) => (
                    <React.Fragment key={app.id}>
                      <ListItem alignItems="flex-start" disablePadding sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {app.user.name.charAt(0)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1">
                                {app.user.name}
                              </Typography>
                              <Rating value={app.user.reputation} precision={0.1} readOnly size="small" />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                                {app.message}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Chip 
                                  size="small"
                                  label={`${app.proposedPrice} $CoAI`}
                                  variant="outlined"
                                  color={app.proposedPrice <= task.price ? "success" : "warning"}
                                />
                                <Chip 
                                  size="small"
                                  label={`Due: ${new Date(app.proposedDeadline).toLocaleDateString()}`}
                                  variant="outlined"
                                  color="primary"
                                />
                              </Box>
                              <Box sx={{ mt: 2 }}>
                                <Button 
                                  variant="contained" 
                                  color="success" 
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  Accept
                                </Button>
                                <Button 
                                  variant="outlined" 
                                  size="small"
                                >
                                  Message
                                </Button>
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button 
          variant="outlined" 
          color="primary"
          component={Link} 
          to="/tasks"
        >
          Back to Tasks
        </Button>
      </Box>
      
      {/* Apply for Task Dialog */}
      <Dialog open={applyDialogOpen} onClose={handleApplyDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for Task</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Tell the task creator why you're a good fit for this task and propose your terms.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Your Message"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={applicationMessage}
            onChange={(e) => setApplicationMessage(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Proposed Price ($CoAI)"
                fullWidth
                variant="outlined"
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                InputProps={{
                  startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>$CoAI</Box>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Proposed Deadline"
                fullWidth
                variant="outlined"
                type="date"
                value={proposedDeadline}
                onChange={(e) => setProposedDeadline(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyDialogClose}>Cancel</Button>
          <Button 
            onClick={handleApplySubmit}
            variant="contained"
            color="primary"
            disabled={!applicationMessage || !proposedPrice || !proposedDeadline}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskDetailsPage; 