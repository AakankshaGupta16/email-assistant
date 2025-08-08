import './App.css';
import { Container, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';

// Create a custom theme for a more polished look
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 600,
      color: '#333',
    },
    h6: {
      fontWeight: 500,
      color: '#555',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', { emailContent, tone });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h3" component="h1" gutterBottom>
                Smart Email Assistant
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Generate professional and friendly email replies with a single click.
              </Typography>
            </Box>

            <Box mb={3}>
              <TextField
                fullWidth
                multiline
                minRows={6}
                label="Paste your email here"
                variant="outlined"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </Box>

            <Box mb={3}>
              <FormControl fullWidth>
                <InputLabel>Tone (Optional)</InputLabel>
                <Select
                  value={tone || ''}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mb={3}>
              <Button
                variant='contained'
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                fullWidth
                sx={{ py: 1.5 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
              </Button>
            </Box>

            {error && (
              <Box mb={2}>
                <Typography color='error' textAlign="center">
                  {error}
                </Typography>
              </Box>
            )}

            {generatedReply && (
              <Box mt={4}>
                <Typography variant='h6' gutterBottom>
                  Generated Reply:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant='outlined'
                  value={generatedReply || ''}
                  inputProps={{ readOnly: true }}
                />
                <Box mt={2} textAlign="right">
                  <Button
                    variant='outlined'
                    onClick={() => navigator.clipboard.writeText(generatedReply)}
                  >
                    Copy to Clipboard
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;