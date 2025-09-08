import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './components/RedirectPage';
import { AuthContext } from './contexts/AuthContext';
import { logEvent } from './utils/loggingMiddleware';
import { getAuthToken } from './utils/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [authToken, setAuthToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await getAuthToken();
        setAuthToken(token);
        await logEvent('info', 'App initialized successfully with auth token', { timestamp: new Date().toISOString() });
      } catch (error) {
        await logEvent('error', 'Failed to initialize app', { error: (error as Error).message });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            Loading...
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{ authToken, setAuthToken }}>
        <Router>
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={
                <>
                  <Navigation />
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <HomePage />
                  </Container>
                </>
              } />
              <Route path="/stats" element={
                <>
                  <Navigation />
                  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <StatsPage />
                  </Container>
                </>
              } />
              <Route path="/:shortcode" element={<RedirectPage />} />
            </Routes>
          </Box>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;