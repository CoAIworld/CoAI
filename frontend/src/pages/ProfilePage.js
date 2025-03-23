import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Avatar, 
  Button, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Tab, 
  Tabs, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Rating,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedIcon from '@mui/icons-material/Verified';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock user data
const MOCK_USER = {
  name: 'Alex Johnson',
  walletAddress: '8xUt45SsPVSKhrmHyGfkqQbQu2Ui9kMFWaAVjLxPMynZ',
  email: 'alex@example.com',
  bio: 'Full stack developer with expertise in Solana and React. Passionate about building decentralized applications and AI integrations.',
  skills: [
    { id: 1, name: 'Solana', level: 4, verifications: 12 },
    { id: 2, name: 'React', level: 5, verifications: 18 },
    { id: 3, name: 'TypeScript', level: 4, verifications: 8 },
    { id: 4, name: 'Smart Contracts', level: 3, verifications: 5 },
    { id: 5, name: 'UI/UX Design', level: 3, verifications: 3 },
  ],
  walletBalance: 450,
  reputation: 4.7,
  tasksCompleted: 23,
  tasksCreated: 7,
  taskHistory: [
    { 
      id: 1, 
      title: 'Develop Solana Wallet Integration', 
      type: 'completed', 
      date: '2023-08-10', 
      payment: 120, 
      rating: 5,
    },
    { 
      id: 2, 
      title: 'Create UI for DeFi Dashboard', 
      type: 'completed', 
      date: '2023-07-25', 
      payment: 180, 
      rating: 5,
    },
    { 
      id: 3, 
      title: 'Smart Contract Audit', 
      type: 'in-progress', 
      date: '2023-08-20', 
      payment: 250, 
      rating: null,
    },
    { 
      id: 4, 
      title: 'Decentralized Storage Integration', 
      type: 'created', 
      date: '2023-08-05', 
      payment: 150, 
      rating: null,
    },
  ],
};

const ProfilePage = () => {
  const { connected, publicKey } = useWallet();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(3);

  // In a real app, we would fetch the user data once connected
  const user = MOCK_USER;
  
  // Format wallet address for display
  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenAddSkill = () => {
    setAddSkillOpen(true);
  };

  const handleCloseAddSkill = () => {
    setAddSkillOpen(false);
    setNewSkillName('');
    setNewSkillLevel(3);
  };

  const handleAddSkill = () => {
    // In a real app, this would call an API to add the skill
    console.log('Adding skill:', { name: newSkillName, level: newSkillLevel });
    handleCloseAddSkill();
  };

  if (!connected) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Connect Your Wallet to View Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            You need to connect your Solana wallet to access your profile and participate in the CoAI ecosystem.
          </Typography>
          <WalletMultiButton />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                alt={user.name}
                src="/static/images/avatar.jpg"
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.name}
              </Typography>
              <Chip
                icon={<AccountBalanceWalletIcon />}
                label={shortenAddress(publicKey ? publicKey.toString() : user.walletAddress)}
                variant="outlined"
                color="primary"
                sx={{ mb: 1 }}
                onClick={() => navigator.clipboard.writeText(publicKey ? publicKey.toString() : user.walletAddress)}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              {user.bio}
            </Typography>
            
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
              fullWidth
              sx={{ mt: 1 }}
            >
              Edit Profile
            </Button>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Wallet & Stats
            </Typography>
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemText 
                  primary="$CoAI Balance" 
                  secondary={`${user.walletBalance} $CoAI`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Reputation" 
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={user.reputation} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({user.reputation}/5)
                      </Typography>
                    </Box>
                  } 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Tasks Completed" 
                  secondary={user.tasksCompleted} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Tasks Created" 
                  secondary={user.tasksCreated} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Tabs for skills, history, etc. */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="fullWidth"
            >
              <Tab icon={<VerifiedIcon />} label="Skills" />
              <Tab icon={<HistoryIcon />} label="Task History" />
              <Tab icon={<BarChartIcon />} label="Analytics" />
            </Tabs>
            
            {/* Skills Tab */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Your Skills
                  </Typography>
                  <Button 
                    startIcon={<AddIcon />} 
                    size="small"
                    onClick={handleOpenAddSkill}
                  >
                    Add Skill
                  </Button>
                </Box>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Skills with more verifications appear higher in task matching.
                </Alert>
                
                <Grid container spacing={2}>
                  {user.skills.map((skill) => (
                    <Grid item xs={12} sm={6} key={skill.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">{skill.name}</Typography>
                            <Chip 
                              size="small" 
                              label={`${skill.verifications} verifications`} 
                              color="primary" 
                            />
                          </Box>
                          <Rating 
                            value={skill.level} 
                            readOnly 
                            size="small" 
                            sx={{ mt: 1 }} 
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Task History Tab */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Task History
                </Typography>
                
                <List>
                  {user.taskHistory.map((task) => (
                    <React.Fragment key={task.id}>
                      <ListItem 
                        alignItems="flex-start"
                        secondaryAction={
                          task.type === 'completed' && (
                            <Rating value={task.rating} readOnly size="small" />
                          )
                        }
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {task.payment} $CoAI
                              </Typography>
                              {" — "}
                              {new Date(task.date).toLocaleDateString()}
                              {" — "}
                              <Chip 
                                label={task.type} 
                                size="small" 
                                color={
                                  task.type === 'completed' 
                                    ? 'success' 
                                    : task.type === 'in-progress' 
                                      ? 'warning' 
                                      : 'default'
                                }
                                sx={{ ml: 1 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Analytics Tab */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Analytics
                </Typography>
                <Alert severity="info">
                  Analytics feature will be available in the next update.
                </Alert>
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Track your earnings, task completion rate, and reputation growth over time.
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Add Skill Dialog */}
      <Dialog open={addSkillOpen} onClose={handleCloseAddSkill}>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Skill Name"
            fullWidth
            variant="outlined"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography gutterBottom>Proficiency Level</Typography>
          <Rating
            name="skill-level"
            value={newSkillLevel}
            onChange={(event, newValue) => {
              setNewSkillLevel(newValue);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddSkill}>Cancel</Button>
          <Button onClick={handleAddSkill} variant="contained" disabled={!newSkillName}>
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage; 