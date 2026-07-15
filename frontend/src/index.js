import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error }) {
  return (
    <div role="alert" style={{ padding: 20 }}>
      <h2>Something went wrong rendering the app:</h2>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // Indigo 600
      light: '#818cf8', // Indigo 400
      dark: '#3730a3', // Indigo 800
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c084fc', // Purple 400
      light: '#e9d5ff', // Purple 200
      dark: '#7e22ce', // Purple 700
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#475569', // Slate 600
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontWeight: 700, letterSpacing: '-0.021em' },
    h3: { fontWeight: 700, letterSpacing: '-0.015em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          padding: '8px 18px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          boxShadow: 'none',
        },
      },
    },
  },
});

const rootElement = document.getElementById('root');
console.log('index.js - Found root element:', rootElement);

const root = ReactDOM.createRoot(rootElement);
console.log('index.js - Calling root.render()');

root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
