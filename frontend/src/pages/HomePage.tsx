import React from 'react';
import { Typography, Box } from '@mui/material';
import UrlShortener from '../components/UrlShortener';

const HomePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Shorten Your URLs
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Create short, memorable links from your long URLs
      </Typography>
      <UrlShortener />
    </Box>
  );
};

export default HomePage;