import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import styles
import './styles/App.css';
import '@solana/wallet-adapter-react-ui/styles.css';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import pages
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import TaskSubmissionPage from './pages/TaskSubmissionPage';
import CreateTaskPage from './pages/CreateTaskPage';
import ProfilePage from './pages/ProfilePage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailsPage from './pages/TransactionDetailsPage';
import FeedbackFormPage from './pages/FeedbackFormPage';
import NotFoundPage from './pages/NotFoundPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  // Solana wallet configuration
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter()];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Router>
              <div className="app">
                <Navbar />
                <div className="content">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    
                    {/* Protected routes (wallet connection required) */}
                    <Route path="/tasks/create" element={<CreateTaskPage />} />
                    <Route path="/tasks/:taskId/submit" element={<TaskSubmissionPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/transactions/:transactionId" element={<TransactionDetailsPage />} />
                    <Route path="/feedback/:taskId/:userId" element={<FeedbackFormPage />} />
                    <Route path="/feedback/:taskId" element={<FeedbackFormPage />} />
                    
                    {/* 404 route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App; 