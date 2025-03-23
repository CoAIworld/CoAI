import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  CardActions,
  Divider,
  Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Placeholder image URLs (replace with actual images in production)
const heroImageUrl = "https://via.placeholder.com/1200x600?text=CoAI+Platform";
const featureImageUrls = [
  "https://via.placeholder.com/300x200?text=AI+Collaboration",
  "https://via.placeholder.com/300x200?text=Fair+Compensation",
  "https://via.placeholder.com/300x200?text=Skill+Graph"
];

const HomePage = () => {
  const { connected } = useWallet();

  return (
    <Box>
      {/* Hero Section */}
      <Paper 
        sx={{
          position: 'relative',
          color: 'white',
          mb: 4,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImageUrl})`,
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              CoAI Platform
            </Typography>
            <Typography variant="h5" paragraph sx={{ mb: 4 }}>
              A decentralized AI collaboration network built on Solana
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {connected ? (
                <Button 
                  variant="contained" 
                  size="large" 
                  color="primary" 
                  component={Link} 
                  to="/tasks"
                >
                  Explore Tasks
                </Button>
              ) : (
                <WalletMultiButton />
              )}
              <Button 
                variant="outlined" 
                size="large" 
                color="secondary" 
                component={Link} 
                to="/tasks"
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Key Features Section */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Key Features
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={featureImageUrls[0]}
                alt="AI Collaboration"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Human-AI Collaboration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seamlessly collaborate with AI to complete tasks more efficiently. 
                  Leverage the power of hybrid intelligence to solve complex problems.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={featureImageUrls[1]}
                alt="Fair Compensation"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Fair Compensation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get fairly compensated for your data, skills, and contributions.
                  Blockchain-based transparency ensures equitable value distribution.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={featureImageUrls[2]}
                alt="Skill Graph"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Skill Graph & Reputation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Build your verifiable skill profile and reputation on the blockchain.
                  Match with tasks and opportunities based on proven capabilities.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: 'primary.dark',
          py: 6,
          px: 2,
          borderRadius: 2,
          mb: 4
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" align="center" color="white" gutterBottom>
            Ready to Join the CoAI Ecosystem?
          </Typography>
          <Typography variant="body1" align="center" color="white" paragraph>
            Connect your wallet and start earning, contributing, and collaborating today.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            {connected ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/tasks/create"
              >
                Create Your First Task
              </Button>
            ) : (
              <WalletMultiButton />
            )}
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary">1</Typography>
              <Typography variant="h6">Connect Wallet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Connect your Solana wallet to access all platform features
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary">2</Typography>
              <Typography variant="h6">Create Profile</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Set up your profile and declare your skills and expertise
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary">3</Typography>
              <Typography variant="h6">Find Tasks</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Browse and accept tasks that match your skills and interests
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary">4</Typography>
              <Typography variant="h6">Earn $CoAI</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Complete tasks and get paid in $CoAI tokens with minimal fees
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 