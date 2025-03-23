import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  useMediaQuery, 
  useTheme,
  Avatar,
  Tooltip 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import logoSvg from '../assets/logo.svg';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { connected } = useWallet();

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Tasks', path: '/tasks' },
    { title: 'Create Task', path: '/tasks/create' },
    { title: 'Profile', path: '/profile', protected: true },
    { title: 'Transactions', path: '/transactions', protected: true },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
        <img src={logoSvg} alt="CoAI Logo" style={{ height: 60 }} />
      </Box>
      <List>
        {navItems
          .filter(item => !item.protected || (item.protected && connected))
          .map((item) => (
            <ListItem 
              button 
              key={item.title} 
              component={Link} 
              to={item.path}
              selected={isActive(item.path)}
            >
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
      </List>
      
      {/* Social links in drawer */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <IconButton 
          component="a" 
          href="https://www.coai.world/" 
          target="_blank" 
          rel="noopener noreferrer"
          color="primary"
        >
          <LanguageIcon />
        </IconButton>
        <IconButton 
          component="a" 
          href="https://x.com/coai_world" 
          target="_blank" 
          rel="noopener noreferrer"
          color="primary"
        >
          <TwitterIcon />
        </IconButton>
        <IconButton 
          component="a" 
          href="https://github.com/CoAIworld/CoAI" 
          target="_blank" 
          rel="noopener noreferrer"
          color="primary"
        >
          <GitHubIcon />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar 
            src={logoSvg} 
            alt="CoAI Logo" 
            component={Link} 
            to="/" 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 1,
              backgroundColor: 'white',
              p: 0.5
            }} 
          />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'white', textDecoration: 'none' }}
          >
            CoAI Platform
          </Typography>
        </Box>
        
        {isMobile ? (
          <>
            <WalletMultiButton />
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Social media links */}
              <Tooltip title="Official Website">
                <IconButton 
                  color="inherit" 
                  component="a" 
                  href="https://www.coai.world/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ mr: 1 }}
                >
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter">
                <IconButton 
                  color="inherit" 
                  component="a" 
                  href="https://x.com/coai_world" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ mr: 1 }}
                >
                  <TwitterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="GitHub">
                <IconButton 
                  color="inherit" 
                  component="a" 
                  href="https://github.com/CoAIworld/CoAI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ mr: 2 }}
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            
              {navItems
                .filter(item => !item.protected || (item.protected && connected))
                .map((item) => (
                  <Button
                    key={item.title}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{ 
                      mx: 1,
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                      borderBottom: isActive(item.path) ? '2px solid white' : 'none',
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              <Box sx={{ ml: 2 }}>
                <WalletMultiButton />
              </Box>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 