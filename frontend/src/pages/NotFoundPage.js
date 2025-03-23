import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          py: 6,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'primary.main', mb: 3 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600 }}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage; 