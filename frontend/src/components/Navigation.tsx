import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link, BarChart } from '@mui/icons-material';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Link sx={{ mr: 2, color: 'white' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<Link />}
            sx={{
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent',
              mr: 1
            }}
          >
            Shorten URL
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/stats"
            startIcon={<BarChart />}
            sx={{
              backgroundColor: location.pathname === '/stats' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;