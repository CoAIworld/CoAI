import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Divider,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock data for tasks (will be replaced with API calls)
const MOCK_TASKS = [
  {
    id: 1,
    title: 'UI Design for AI Assistant Interface',
    description: 'Create a modern, intuitive UI for an AI assistant that helps users organize their daily tasks and schedules.',
    category: 'Design',
    requiredSkills: ['UI/UX Design', 'Figma', 'Adobe XD'],
    price: 150,
    deadline: '2023-09-30',
    aiAssistanceLevel: 'Low',
    status: 'open',
    createdAt: '2023-08-15',
  },
  {
    id: 2,
    title: 'Develop Smart Contract for NFT Marketplace',
    description: 'Create a Solana smart contract for a new NFT marketplace with royalty features and auction capabilities.',
    category: 'Development',
    requiredSkills: ['Solana', 'Rust', 'Smart Contracts'],
    price: 300,
    deadline: '2023-10-15',
    aiAssistanceLevel: 'Medium',
    status: 'open',
    createdAt: '2023-08-18',
  },
  {
    id: 3,
    title: 'Fine-tune AI Model for Medical Text Analysis',
    description: 'Fine-tune an existing language model to better understand and extract key information from medical reports.',
    category: 'AI & Machine Learning',
    requiredSkills: ['Python', 'TensorFlow', 'NLP'],
    price: 250,
    deadline: '2023-10-05',
    aiAssistanceLevel: 'High',
    status: 'open',
    createdAt: '2023-08-20',
  },
  {
    id: 4,
    title: 'Create Content for AI Ethics Blog',
    description: 'Write a series of blog posts about ethical considerations in AI development and deployment.',
    category: 'Content',
    requiredSkills: ['Content Writing', 'AI Knowledge', 'SEO'],
    price: 100,
    deadline: '2023-09-25',
    aiAssistanceLevel: 'Medium',
    status: 'open',
    createdAt: '2023-08-10',
  },
  {
    id: 5,
    title: 'Solana Wallet Integration for Web App',
    description: 'Integrate Solana wallet connection and transaction capabilities into an existing web application.',
    category: 'Development',
    requiredSkills: ['JavaScript', 'React', 'Solana Web3.js'],
    price: 180,
    deadline: '2023-10-10',
    aiAssistanceLevel: 'Low',
    status: 'open',
    createdAt: '2023-08-22',
  },
  {
    id: 6,
    title: 'Dataset Labeling for Computer Vision Model',
    description: 'Label a dataset of 5,000 images for training a computer vision model for retail product recognition.',
    category: 'Data',
    requiredSkills: ['Data Labeling', 'Computer Vision', 'Attention to Detail'],
    price: 120,
    deadline: '2023-09-20',
    aiAssistanceLevel: 'High',
    status: 'open',
    createdAt: '2023-08-17',
  },
];

const TasksPage = () => {
  const { connected } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  
  // Filter and sort tasks
  const filteredTasks = MOCK_TASKS.filter(task => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = category === '' || task.category === category;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort tasks
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'priceHigh') {
      return b.price - a.price;
    } else if (sortBy === 'priceLow') {
      return a.price - b.price;
    } else if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  });
  
  // Pagination
  const tasksPerPage = 4;
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const displayedTasks = filteredTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );
  
  // Categories for filter (derived from mock data)
  const categories = [...new Set(MOCK_TASKS.map(task => task.category))];
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse and find tasks that match your skills and interests.
        </Typography>
        
        {!connected && (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={<WalletMultiButton />}
          >
            Connect your wallet to apply for tasks and earn $CoAI tokens.
          </Alert>
        )}
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">
                <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                Category
              </InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="sort-select-label">
                <SortIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 20 }} />
                Sort By
              </InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                <MenuItem value="priceLow">Price: Low to High</MenuItem>
                <MenuItem value="deadline">Deadline: Soonest</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component={Link}
              to="/tasks/create"
              sx={{ height: '100%' }}
            >
              Create
            </Button>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 4 }} />
        
        {displayedTasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              No tasks match your filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or create a new task.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/tasks/create"
              sx={{ mt: 3 }}
            >
              Create Task
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {displayedTasks.map((task) => (
                <Grid item xs={12} md={6} key={task.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          label={task.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">{task.price} $CoAI</Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="h6" component="h2" gutterBottom>
                        {task.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                        {task.description.length > 120 
                          ? `${task.description.substring(0, 120)}...` 
                          : task.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {task.requiredSkills.map((skill) => (
                            <Chip 
                              key={skill} 
                              label={skill} 
                              size="small" 
                              sx={{ marginBottom: '4px' }} 
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Chip 
                          label={`AI: ${task.aiAssistanceLevel}`} 
                          size="small" 
                          color="secondary" 
                        />
                      </Box>
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        size="small" 
                        component={Link} 
                        to={`/tasks/${task.id}`}
                      >
                        View Details
                      </Button>
                      {connected && (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          component={Link} 
                          to={`/tasks/${task.id}`}
                        >
                          Apply
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(event, value) => setPage(value)}
                color="primary" 
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default TasksPage; 