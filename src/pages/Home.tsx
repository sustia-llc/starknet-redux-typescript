import { Box, Button, Container, Grid, Typography } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../app/hooks';
import { WalletStatusEnums, selectWallet } from '../features/wallet/walletSlice';
export function Home() {
  const { address, chainId, balance, status } = useAppSelector(selectWallet);
  return (
    <Container>
      <Box my={4}>
        { status !== WalletStatusEnums.CONNECTED && (
          <Typography variant="h3" gutterBottom align="center">
            Connect to Wallet
          </Typography>
        )}
        { status === WalletStatusEnums.CONNECTED && (
          <Box my={4}>
            <Typography variant="h3" gutterBottom align="center">
              Wallet Connected
            </Typography>
            <Typography variant="h4" gutterBottom align="center">
              Address: { address.slice(0, 6) + "..." + address.slice(-4) }
            </Typography>
            <Typography variant="h4" gutterBottom align="center">
              ChainId: { chainId }
            </Typography>
            <Typography variant="h4" gutterBottom align="center">
              Balance: { balance?.toString()}
            </Typography>
          </Box>
        ) }
      </Box>
    </Container>
  );
}

export default Home;
