import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WalletProvider } from '@solana/wallet-adapter-react';
import Navbar from '../components/Navbar';

// Mock the wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  ...jest.requireActual('@solana/wallet-adapter-react'),
  useWallet: () => ({
    connected: false,
    publicKey: null,
  }),
  WalletProvider: ({ children }) => <div>{children}</div>,
}));

// Mock the wallet adapter UI
jest.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Connect Wallet</button>,
}));

// Mock the logo
jest.mock('../assets/logo.svg', () => 'logo-url');

describe('Navbar Component', () => {
  test('renders CoAI Platform text', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('CoAI Platform')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  test('renders social media links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Check for the social links (we can't easily test the icons, 
    // but we can check for the buttons with their aria-labels or tooltips)
    expect(screen.getByTitle('GitHub')).toBeInTheDocument();
    expect(screen.getByTitle('Twitter')).toBeInTheDocument();
    expect(screen.getByTitle('Official Website')).toBeInTheDocument();
  });
}); 