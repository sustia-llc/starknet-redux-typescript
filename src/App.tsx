import React, { useState } from 'react';
import logo from './logo.svg';
import { Header } from './features/wallet/Wallet';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import theme from './styles/theme';
import { useAppSelector } from './app/hooks';
import { selectWallet } from './features/wallet/walletSlice';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';

function App() {
  const wallet = useAppSelector(selectWallet);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const appTheme = theme(darkMode);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <BrowserRouter>
          <Header />
          <Box>
          <Routes>
            <Route path='/' element={<HomePage />} />                
            <Route path='*' element={<HomePage />} />
          </Routes>
          </Box>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
