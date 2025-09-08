import React from 'react';
import { Typography, Box } from '@mui/material';
import Statistics from '../components/Statistics';

const StatsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        URL Statistics
      </Typography>
      <Statistics />
    </Box>
  );
};

export default StatsPage;