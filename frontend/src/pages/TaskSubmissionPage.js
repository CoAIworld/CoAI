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
  TextField,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  AttachFile as AttachFileIcon,
  Upload as UploadIcon,
  Check as CheckIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mocked task data - in a real app, this would come from an API
const MOCK_TASK = {
  id: 2,
  title: 'Develop Smart Contract for NFT Marketplace',
  description: 'Create a Solana smart contract for a new NFT marketplace with royalty features and auction capabilities.',
  category: 'Development',
  requiredSkills: ['Solana', 'Rust', 'Smart Contracts', 'NFTs'],
  price: 300,
  deadline: '2023-10-15',
  status: 'in-progress',
  creator: {
    id: 1,
    name: 'Sarah Chen',
    wallet: '3xGu7...',
  },
  assignedTo: {
    id: 2,
    name: 'Michael Rodriguez',
    wallet: '5qWt2...',
  }
};

const TaskSubmissionPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [submissionText, setSubmissionText] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // In a real app, fetch the task from the API
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setTask(MOCK_TASK);
      setLoading(false);
    }, 1000);
  }, [taskId]);
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleConfirmOpen = () => {
    if (!submissionText.trim()) {
      setError('Please provide a submission description');
      return;
    }
    setConfirmOpen(true);
  };
  
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    // Prepare form data with files
    const formData = new FormData();
    formData.append('description', submissionText);
    files.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });
    
    // In a real app, this would be an API call
    // Simulating API call with timeout
    setTimeout(() => {
      console.log('Submission data:', {
        taskId,
        description: submissionText,
        filesCount: files.length,
      });
      
      setSubmitting(false);
      setConfirmOpen(false);
      setSubmitSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/tasks/${taskId}`);
      }, 2000);
    }, 1500);
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
  
  if (error && !submissionText.trim()) {
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
            to={`/tasks/${taskId}`}
            startIcon={<ArrowBackIcon />}
          >
            Back to Task
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (submitSuccess) {
    return (
      <Container maxWidth="md">
        <Alert 
          severity="success" 
          sx={{ mt: 4 }}
          icon={<CheckIcon fontSize="inherit" />}
        >
          Your task submission has been received! Redirecting to task details...
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
        </Box>
      </Container>
    );
  }
  
  // Check if the current user is the assignee
  const isAssignee = connected && publicKey?.toString() === task?.assignedTo.wallet;
  
  // If not the assignee, don't allow submission
  if (!isAssignee) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 4 }}>
          You are not authorized to submit work for this task.
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to={`/tasks/${taskId}`}
            startIcon={<ArrowBackIcon />}
          >
            Back to Task
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!task) return null;
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Button 
        component={Link}
        to={`/tasks/${taskId}`}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Task
      </Button>
      
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Submit Your Work
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Task: {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={task.category} color="primary" size="small" />
            <Chip label={`${task.price} $CoAI`} color="secondary" size="small" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Deadline: {new Date(task.deadline).toLocaleDateString()}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Submission Details
              </Typography>
              <TextField
                label="Describe your work and how you met the requirements"
                multiline
                rows={6}
                fullWidth
                variant="outlined"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                required
                error={error && !submissionText.trim()}
                helperText={error && !submissionText.trim() ? error : ''}
                sx={{ mb: 3 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Attachments
              </Typography>
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*,application/pdf,text/plain,application/zip"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<AttachFileIcon />}
                  >
                    Add Files
                  </Button>
                </label>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Accepted file types: Images, PDFs, text files, and zip archives
                </Typography>
              </Box>
              
              {files.length > 0 && (
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      {files.length} file(s) selected
                    </Typography>
                    <List dense>
                      {files.map((file, index) => (
                        <ListItem 
                          key={index}
                          secondaryAction={
                            <Button 
                              color="error" 
                              size="small"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <CancelIcon fontSize="small" />
                            </Button>
                          }
                        >
                          <ListItemIcon>
                            <AttachFileIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary={file.name} 
                            secondary={`${(file.size / 1024).toFixed(2)} KB`} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<UploadIcon />}
                  onClick={handleConfirmOpen}
                  disabled={!submissionText.trim() || submitting}
                  sx={{ minWidth: 200 }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Work'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your work? After submission, the task creator will review your work and release payment if accepted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            startIcon={<AssignmentTurnedInIcon />}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Confirm Submission'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskSubmissionPage; 