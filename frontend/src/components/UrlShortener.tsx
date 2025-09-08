import React, { useState } from 'react';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  Chip,
  IconButton,
  Typography,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add, Remove, ContentCopy } from '@mui/icons-material';
import { shortenUrl } from '../utils/api';
import { logEvent } from '../utils/loggingMiddleware';
import { validateUrl, validateShortcode } from '../utils/validation';

interface UrlForm {
  id: string;
  longUrl: string;
  validity: number;
  customShortcode: string;
  error?: string;
}

interface ShortenedResult {
  id: string;
  shortUrl: string;
  longUrl: string;
  expiresAt: string;
  shortcode: string;
}

const UrlShortener: React.FC = () => {
  const [forms, setForms] = useState<UrlForm[]>([
    { id: '1', longUrl: '', validity: 30, customShortcode: '' }
  ]);
  const [results, setResults] = useState<ShortenedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const addUrlForm = async () => {
    if (forms.length < 5) {
      const newForm: UrlForm = {
        id: Date.now().toString(),
        longUrl: '',
        validity: 30,
        customShortcode: ''
      };
      setForms([...forms, newForm]);
      await logEvent('info', 'URL form added', { formsCount: forms.length + 1 });
    }
  };

  const removeUrlForm = async (id: string) => {
    if (forms.length > 1) {
      setForms(forms.filter(form => form.id !== id));
      await logEvent('info', 'URL form removed', { formsCount: forms.length - 1 });
    }
  };

  const updateForm = (id: string, field: keyof UrlForm, value: string | number) => {
    setForms(forms.map(form => 
      form.id === id ? { ...form, [field]: value, error: undefined } : form
    ));
  };

  const validateForms = async (): Promise<boolean> => {
    let isValid = true;
    const updatedForms = forms.map(form => {
      let error = '';

      if (!form.longUrl) {
        error = 'URL is required';
        isValid = false;
      } else if (!validateUrl(form.longUrl)) {
        error = 'Invalid URL format';
        isValid = false;
      } else if (form.customShortcode && !validateShortcode(form.customShortcode)) {
        error = 'Invalid shortcode format (alphanumeric, 4-10 characters)';
        isValid = false;
      } else if (form.validity < 1) {
        error = 'Validity must be a positive number';
        isValid = false;
      }

      return { ...form, error };
    });

    setForms(updatedForms);

    if (!isValid) {
      await logEvent('warn', 'Form validation failed', { errors: updatedForms.filter(f => f.error).map(f => f.error) });
    }

    return isValid;
  };

  const handleShortenUrls = async () => {
    await logEvent('info', 'URL shortening process initiated', { formsCount: forms.length });
    
    const isValid = await validateForms();
    if (!isValid) return;

    setLoading(true);
    const newResults: ShortenedResult[] = [];

    try {
      for (const form of forms) {
        try {
          await logEvent('info', 'API call initiated for URL shortening', { 
            longUrl: form.longUrl,
            validity: form.validity,
            customShortcode: form.customShortcode 
          });

          const result = await shortenUrl(form.longUrl, form.validity, form.customShortcode);
          
          newResults.push({
            id: form.id,
            shortUrl: `${window.location.origin}/${result.shortcode}`,
            longUrl: form.longUrl,
            expiresAt: new Date(Date.now() + form.validity * 60 * 1000).toISOString(),
            shortcode: result.shortcode
          });

          await logEvent('success', 'URL shortened successfully', { 
            shortcode: result.shortcode,
            longUrl: form.longUrl 
          });
        } catch (error) {
          await logEvent('error', 'URL shortening failed', { 
            error: (error as Error).message,
            longUrl: form.longUrl 
          });
          throw error;
        }
      }

      setResults(newResults);
      setSnackbar({ open: true, message: 'URLs shortened successfully!', severity: 'success' });
      
      setForms([{ id: Date.now().toString(), longUrl: '', validity: 30, customShortcode: '' }]);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error shortening URLs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, shortcode: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
      await logEvent('info', 'URL copied to clipboard', { shortcode });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to copy to clipboard', severity: 'error' });
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Enter URLs to Shorten
        </Typography>
        
        {forms.map((form, index) => (
          <Paper key={form.id} elevation={1} sx={{ p: 3, mb: 2, backgroundColor: '#fafafa' }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12}>
                <Typography variant="h6" color="primary">
                  URL #{index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={form.longUrl}
                  onChange={(e) => updateForm(form.id, 'longUrl', e.target.value)}
                  error={!!form.error && form.error.includes('URL')}
                  helperText={form.error && form.error.includes('URL') ? form.error : ''}
                  placeholder="https://example.com/very-long-url"
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Validity (minutes)"
                  value={form.validity}
                  onChange={(e) => updateForm(form.id, 'validity', parseInt(e.target.value) || 30)}
                  error={!!form.error && form.error.includes('Validity')}
                  helperText={form.error && form.error.includes('Validity') ? form.error : 'Default: 30 minutes'}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  label="Custom Code"
                  value={form.customShortcode}
                  onChange={(e) => updateForm(form.id, 'customShortcode', e.target.value)}
                  error={!!form.error && form.error.includes('shortcode')}
                  helperText={form.error && form.error.includes('shortcode') ? form.error : 'Optional'}
                  placeholder="abc123"
                />
              </Grid>
              <Grid item xs={12} md={1}>
                {forms.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeUrlForm(form.id)}
                    sx={{ mt: 1 }}
                  >
                    <Remove />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {forms.length < 5 && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addUrlForm}
            >
              Add Another URL
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            onClick={handleShortenUrls}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : undefined}
          >
            {loading ? 'Shortening...' : 'Shorten URLs'}
          </Button>
        </Box>
      </Paper>

      {results.length > 0 && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Shortened URLs
          </Typography>
          {results.map((result) => (
            <Paper key={result.id} elevation={1} sx={{ p: 3, mb: 2, backgroundColor: '#f5f5f5' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Original URL:
                  </Typography>
                  <Typography variant="body2" noWrap title={result.longUrl}>
                    {result.longUrl.length > 50 ? `${result.longUrl.substring(0, 50)}...` : result.longUrl}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Short URL:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>
                      {result.shortUrl}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(result.shortUrl, result.shortcode)}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Expires At:
                  </Typography>
                  <Chip
                    label={new Date(result.expiresAt).toLocaleString()}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={() => copyToClipboard(result.shortUrl, result.shortcode)}
                  >
                    Copy
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UrlShortener;