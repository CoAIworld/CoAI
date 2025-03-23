import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  InputAdornment,
  Slider,
  FormHelperText,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock categories and skill options (will be fetched from API in real app)
const CATEGORIES = [
  'Development',
  'Design',
  'Content',
  'Data',
  'AI & Machine Learning',
  'Marketing',
  'Research',
  'Other'
];

const SKILLS = [
  'JavaScript',
  'React',
  'TypeScript',
  'Solana',
  'Rust',
  'Python',
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'Content Writing',
  'Data Analysis',
  'Machine Learning',
  'Smart Contracts',
  'Web3',
  'NFTs',
  'SEO',
  'Marketing',
  'Research'
];

const AI_ASSISTANCE_LEVELS = [
  { value: 'Low', description: 'Minimal AI assistance - human skills are primary' },
  { value: 'Medium', description: 'Balanced collaboration between human and AI' },
  { value: 'High', description: 'Significant AI assistance, human provides guidance' }
];

const CreateTaskPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { connected } = useWallet();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [aiAssistanceLevel, setAiAssistanceLevel] = useState('Medium');
  const [attachments, setAttachments] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
    if (!price) newErrors.price = 'Price is required';
    else if (isNaN(price) || Number(price) <= 0) newErrors.price = 'Price must be a positive number';
    if (!deadline) newErrors.deadline = 'Deadline is required';
    else if (new Date(deadline) <= new Date()) newErrors.deadline = 'Deadline must be in the future';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSkillChange = (event) => {
    const {
      target: { value },
    } = event;
    setRequiredSkills(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setAttachments([...attachments, ...files]);
  };
  
  const handleRemoveFile = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };
  
  const handleClosePreview = () => {
    setShowPreview(false);
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Prepare the task data
    const taskData = {
      title,
      description,
      category,
      requiredSkills,
      price: Number(price),
      deadline,
      aiAssistanceLevel,
      // In a real app, we would handle file uploads here
    };
    
    // Simulate API call
    console.log('Submitting task:', taskData);
    
    // Simulate a delay for the API call
    setTimeout(() => {
      setLoading(false);
      setSubmitSuccess(true);
      
      // Redirect to tasks page after a short delay
      setTimeout(() => {
        navigate('/tasks');
      }, 2000);
    }, 1500);
  };
  
  if (!connected) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Connect Your Wallet to Create a Task
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            You need to connect your Solana wallet to create tasks on the CoAI platform.
          </Typography>
          <WalletMultiButton />
        </Box>
      </Container>
    );
  }
  
  if (submitSuccess) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="success.main" gutterBottom>
            Task Created Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Your task has been created and is now available for contributors to apply.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            to="/tasks"
          >
            View All Tasks
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Task
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Describe your task to find the perfect contributor from the CoAI community.
        </Typography>
      </Box>
      
      <Paper sx={{ p: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Task title */}
          <Grid item xs={12}>
            <TextField
              label="Task Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          
          {/* Task description */}
          <Grid item xs={12}>
            <TextField
              label="Task Description"
              fullWidth
              required
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          
          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
              {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Price */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price in $CoAI"
              fullWidth
              required
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$CoAI</InputAdornment>,
              }}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          
          {/* Required skills */}
          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.requiredSkills}>
              <InputLabel id="skills-label">Required Skills</InputLabel>
              <Select
                labelId="skills-label"
                multiple
                value={requiredSkills}
                onChange={handleSkillChange}
                input={<OutlinedInput label="Required Skills" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {SKILLS.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
              {errors.requiredSkills && <FormHelperText>{errors.requiredSkills}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Deadline */}
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    fullWidth 
                    required 
                    error={!!errors.deadline}
                    helperText={errors.deadline}
                  />
                )}
                minDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          {/* AI Assistance Level */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="ai-assistance-label">AI Assistance Level</InputLabel>
              <Select
                labelId="ai-assistance-label"
                value={aiAssistanceLevel}
                label="AI Assistance Level"
                onChange={(e) => setAiAssistanceLevel(e.target.value)}
              >
                {AI_ASSISTANCE_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* AI Assistance Description */}
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                bgcolor: 'background.paper', 
                borderColor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  AI Assistance: {aiAssistanceLevel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {AI_ASSISTANCE_LEVELS.find(level => level.value === aiAssistanceLevel)?.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          {/* File attachments */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Attachments (Optional)
            </Typography>
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                mb: 2,
              }}
            >
              <input
                accept="image/*, application/pdf, .doc, .docx, .xls, .xlsx"
                style={{ display: 'none' }}
                id="file-upload"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Files
                </Button>
              </label>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Supported formats: Images, PDF, DOC, DOCX, XLS, XLSX
              </Typography>
            </Box>
            
            {attachments.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Uploaded Files:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => handleRemoveFile(index)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
          
          {/* Submit buttons */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              color="primary"
              component={Link}
              to="/tasks"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handlePreview}
            >
              Preview & Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={handleClosePreview}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Task Preview</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="h5" gutterBottom>{title}</Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={category} color="primary" size="small" />
              <Chip label={`${price} $CoAI`} variant="outlined" size="small" />
              <Chip 
                label={`Due: ${deadline ? new Date(deadline).toLocaleDateString() : 'Not set'}`} 
                variant="outlined" 
                size="small" 
              />
              <Chip label={`AI: ${aiAssistanceLevel}`} color="secondary" variant="outlined" size="small" />
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {description}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>Required Skills</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {requiredSkills.map((skill) => (
                <Chip key={skill} label={skill} size="small" />
              ))}
            </Box>
            
            {attachments.length > 0 && (
              <>
                <Typography variant="subtitle1" gutterBottom>Attachments</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      size="small"
                    />
                  ))}
                </Box>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Edit</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateTaskPage; 