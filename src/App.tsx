import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {
  Container,
  CssBaseline,
} from '@mui/material';
import { Header } from './features/wallet/Wallet';
import theme from './styles/theme';
import { Counter } from './features/counter/Counter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Container maxWidth="sm">
        <Header />
        <Counter />
      </Container>
    </ThemeProvider>
  );
}

export default App;
