import React from 'react';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import {
  Container,
  CssBaseline,
  Grid,
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
        <Grid container rowSpacing={5}>
          <Grid item xs={12}>
            <Header />
          </Grid>
          <Grid item xs={12}>
            <Counter />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
