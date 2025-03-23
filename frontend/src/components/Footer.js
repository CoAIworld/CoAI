import React from 'react';
import { Box, Typography, Link, Container, Grid, Divider } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#1a1a1a',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              CoAI Platform
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A decentralized AI collaboration network built on Solana.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Link href="https://x.com/coai_world" color="inherit" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
              </Link>
              <Link href="https://github.com/CoAIworld/CoAI" color="inherit" target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </Link>
              <Link href="https://t.me/coai_world" color="inherit" target="_blank" rel="noopener noreferrer">
                <TelegramIcon />
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="/tasks" color="inherit" display="block" sx={{ mb: 1 }}>
              Tasks
            </Link>
            <Link href="/tasks/create" color="inherit" display="block" sx={{ mb: 1 }}>
              Create Task
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Resources
            </Typography>
            <Link href="https://github.com/CoAIworld/CoAI#readme" color="inherit" display="block" sx={{ mb: 1 }} target="_blank" rel="noopener noreferrer">
              Documentation
            </Link>
            <Link href="https://github.com/CoAIworld/CoAI/tree/main/docs/api" color="inherit" display="block" sx={{ mb: 1 }} target="_blank" rel="noopener noreferrer">
              API
            </Link>
            <Link href="https://www.coai.world/faq" color="inherit" display="block" sx={{ mb: 1 }} target="_blank" rel="noopener noreferrer">
              FAQ
            </Link>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} CoAI Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 