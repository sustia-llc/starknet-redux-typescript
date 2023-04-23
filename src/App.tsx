import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {
  Container,
  CssBaseline,
  Grid,
  Typography,
} from '@mui/material';
import { WalletStatus, Footer } from './features/wallet/Wallet';
import theme from './styles/theme';
import { Counter } from './features/counter/Counter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Container maxWidth="sm">
        <Grid container rowSpacing={5}>
          <Grid item xs={12}>
            <img src={logo} className="App-logo" alt="logo" />
            <Typography variant="h4" component="h1" gutterBottom>
              Starknet PoC
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Counter />
          </Grid>
          <Grid item xs={12}>
            <WalletStatus />
          </Grid>
          <Grid item xs={12}>
            <Footer />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
