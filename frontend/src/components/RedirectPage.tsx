import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper, Alert, Button } from '@mui/material';
import { Home } from '@mui/icons-material';
import { logEvent } from '../utils/loggingMiddleware';

const RedirectPage: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortcode) {
        setError('Invalid short URL');
        setLoading(false);
        return;
      }

      try {
        await logEvent('info', 'Short URL accessed for redirection', { shortcode });

        const storedUrls = localStorage.getItem('shortenedUrls');
        const urlMappings = storedUrls ? JSON.parse(storedUrls) : {};

        if (urlMappings[shortcode]) {
          const urlData = urlMappings[shortcode];
          
          if (new Date() > new Date(urlData.expiresAt)) {
            await logEvent('warn', 'Attempted to access expired short URL', { 
              shortcode, 
              expiresAt: urlData.expiresAt 
            });
            setError('This short URL has expired');
            setLoading(false);
            return;
          }

          urlData.clicks = (urlData.clicks || 0) + 1;
          urlData.clickDetails = urlData.clickDetails || [];
          urlData.clickDetails.push({
            timestamp: new Date().toISOString(),
            source: document.referrer || 'Direct',
            location: 'Unknown'
          });

          urlMappings[shortcode] = urlData;
          localStorage.setItem('shortenedUrls', JSON.stringify(urlMappings));

          await logEvent('success', 'Short URL redirected successfully', { 
            shortcode, 
            longUrl: urlData.longUrl,
            totalClicks: urlData.clicks 
          });

          window.location.href = urlData.longUrl;
        } else {
          await logEvent('error', 'Short URL not found', { shortcode });
          setError('Short URL not found');
          setLoading(false);
        }
      } catch (err) {
        await logEvent('error', 'Error during redirection', { 
          shortcode, 
          error: (err as Error).message 
        });
        setError('An error occurred during redirection');
        setLoading(false);
      }
    };

    const timer = setTimeout(handleRedirect, 1000);
    return () => clearTimeout(timer);
  }, [shortcode]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 400 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom>
            Redirecting...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Taking you to your destination
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Short code: <strong>{shortcode}</strong>
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{ backgroundColor: '#f5f5f5', p: 2 }}
    >
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {error}
          </Typography>
        </Alert>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The short URL "{shortcode}" could not be found or has expired.
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => window.location.href = '/'}
          size="large"
        >
          Go to Homepage
        </Button>
      </Paper>
    </Box>
  );
};

export default RedirectPage;