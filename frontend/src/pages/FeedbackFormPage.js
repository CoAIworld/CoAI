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
  Rating,
  Slider,
  Avatar,
  FormControl,
  FormLabel,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Star as StarIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Add as AddIcon,
  Close as CloseIcon,
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
  status: 'completed',
  creator: {
    id: 1,
    name: 'Sarah Chen',
    walletAddress: '3xGu7...',
  },
  assignedTo: {
    id: 2,
    name: 'Michael Rodriguez',
    walletAddress: '5qWt2...',
  },
  completedAt: '2023-09-10T15:30:45Z',
};

const FeedbackFormPage = () => {
  const { taskId, userId } = useParams();
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receiver, setReceiver] = useState(null);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [skillRatings, setSkillRatings] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillRating, setNewSkillRating] = useState(3);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // In a real app, fetch the task and receiver from the API
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setTask(MOCK_TASK);
      
      // Determine the receiver based on userId or current user role
      if (userId) {
        // If userId is provided in the URL, that's the receiver
        const isCreator = MOCK_TASK.creator.id.toString() === userId;
        setReceiver(isCreator ? MOCK_TASK.creator : MOCK_TASK.assignedTo);
      } else {
        // Otherwise determine based on current user (assuming current user is the creator for demo)
        setReceiver(MOCK_TASK.assignedTo);
      }
      
      // Pre-populate skill ratings based on task required skills
      setSkillRatings(MOCK_TASK.requiredSkills.map(skill => ({
        skill,
        rating: 3,
      })));
      
      setLoading(false);
    }, 1000);
  }, [taskId, userId]);
  
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    
    // Clear error when user makes a selection
    if (errors.rating && newValue > 0) {
      setErrors({ ...errors, rating: null });
    }
  };
  
  const handleCommentChange = (event) => {
    setComment(event.target.value);
    
    // Clear error if user starts typing
    if (errors.comment && event.target.value.trim()) {
      setErrors({ ...errors, comment: null });
    }
  };
  
  const handleSkillRatingChange = (index, newValue) => {
    const updatedSkillRatings = [...skillRatings];
    updatedSkillRatings[index].rating = newValue;
    setSkillRatings(updatedSkillRatings);
  };
  
  const handleAddSkillOpen = () => {
    setAddSkillOpen(true);
  };
  
  const handleAddSkillClose = () => {
    setAddSkillOpen(false);
    setNewSkill('');
    setNewSkillRating(3);
  };
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) {
      return;
    }
    
    // Check if skill already exists
    const skillExists = skillRatings.some(
      sr => sr.skill.toLowerCase() === newSkill.trim().toLowerCase()
    );
    
    if (!skillExists) {
      setSkillRatings([
        ...skillRatings,
        {
          skill: newSkill.trim(),
          rating: newSkillRating,
        }
      ]);
    }
    
    handleAddSkillClose();
  };
  
  const handleRemoveSkill = (index) => {
    const updatedSkillRatings = [...skillRatings];
    updatedSkillRatings.splice(index, 1);
    setSkillRatings(updatedSkillRatings);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (rating === 0) {
      newErrors.rating = 'Please provide an overall rating';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Please provide feedback comments';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Comment should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    // In a real app, this would be an API call
    // Simulating API call with timeout
    setTimeout(() => {
      console.log('Feedback data:', {
        taskId,
        receiverId: receiver.id,
        rating,
        comment,
        skillRatings,
      });
      
      setSubmitting(false);
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
          Your feedback has been submitted successfully! Redirecting to task details...
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
        </Box>
      </Container>
    );
  }
  
  if (!connected) {
    return (
      <Container maxWidth="md">
        <Alert 
          severity="info" 
          sx={{ mt: 4 }}
          action={<WalletMultiButton />}
        >
          Please connect your wallet to leave feedback
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
  
  if (!task || !receiver) return null;
  
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
          Leave Feedback
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Task: {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={task.category} color="primary" size="small" />
            <Chip label={`${task.price} $CoAI`} color="secondary" size="small" />
            <Chip 
              label="Completed" 
              color="success" 
              size="small" 
              icon={<CheckIcon />} 
            />
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Feedback for:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {receiver.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {receiver.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wallet: {receiver.walletAddress}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <form>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                error={!!errors.rating}
                sx={{ mb: 3 }}
              >
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Overall Rating
                </FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating
                    name="overall-rating"
                    value={rating}
                    onChange={handleRatingChange}
                    precision={0.5}
                    size="large"
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {rating > 0 ? `${rating}/5` : 'Not rated'}
                  </Typography>
                </Box>
                {errors.rating && (
                  <FormHelperText error>{errors.rating}</FormHelperText>
                )}
              </FormControl>
              
              <FormControl 
                fullWidth 
                error={!!errors.comment}
                sx={{ mb: 4 }}
              >
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Comments
                </FormLabel>
                <TextField
                  multiline
                  rows={4}
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Provide detailed feedback about your experience working with this person"
                  variant="outlined"
                  fullWidth
                  error={!!errors.comment}
                  helperText={errors.comment}
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Skill Ratings
                </Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  variant="outlined" 
                  size="small"
                  onClick={handleAddSkillOpen}
                >
                  Add Skill
                </Button>
              </Box>
              
              <Paper variant="outlined" sx={{ p: 3 }}>
                {skillRatings.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                    No skills added yet. Click "Add Skill" to rate specific skills.
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    {skillRatings.map((skillRating, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          border: '1px solid', 
                          borderColor: 'divider',
                          borderRadius: 1,
                          position: 'relative'
                        }}>
                          <Button
                            size="small"
                            color="error"
                            sx={{ position: 'absolute', top: 5, right: 5, minWidth: 'auto', p: 0.5 }}
                            onClick={() => handleRemoveSkill(index)}
                          >
                            <CloseIcon fontSize="small" />
                          </Button>
                          
                          <Typography variant="subtitle1" gutterBottom>
                            {skillRating.skill}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography id={`skill-rating-${index}`} sx={{ mr: 2, minWidth: 30 }}>
                              {skillRating.rating}/5
                            </Typography>
                            <Slider
                              value={skillRating.rating}
                              onChange={(e, newValue) => handleSkillRatingChange(index, newValue)}
                              aria-labelledby={`skill-rating-${index}`}
                              step={0.5}
                              marks
                              min={1}
                              max={5}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={submitting}
                  sx={{ minWidth: 200 }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      {/* Add Skill Dialog */}
      <Dialog
        open={addSkillOpen}
        onClose={handleAddSkillClose}
      >
        <DialogTitle>Add Skill to Rate</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add a specific skill to rate for this person's performance on the task.
          </DialogContentText>
          
          <TextField
            autoFocus
            margin="dense"
            label="Skill Name"
            fullWidth
            variant="outlined"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Typography id="new-skill-rating" gutterBottom>
            Initial Rating: {newSkillRating}/5
          </Typography>
          <Slider
            value={newSkillRating}
            onChange={(e, newValue) => setNewSkillRating(newValue)}
            aria-labelledby="new-skill-rating"
            step={0.5}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddSkillClose}>Cancel</Button>
          <Button 
            onClick={handleAddSkill}
            color="primary"
            variant="contained"
            disabled={!newSkill.trim()}
          >
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeedbackFormPage; 