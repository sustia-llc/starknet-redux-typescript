import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { connect, disconnect, selectWallet,  WalletStatusEnums } from './walletSlice';
import { Alert, AlertTitle, AppBar, Toolbar, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function Header() {
  const { provider, address, chainId, status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();
  const connected = status === WalletStatusEnums.CONNECTED;

  const handleButtonClick = () => {
    if (connected) {
      dispatch(disconnect());
    } else {
      dispatch(connect());
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Starknet PoC
          </Typography>
          <Typography variant="body1" component="span" sx={{ marginRight: 2 }}>
            {chainId}
          </Typography>
          <Typography variant="body1" component="span" sx={{ marginRight: 2 }}>
            {connected ? address.slice(0, 6) + "..." + address.slice(-4) : ""}
          </Typography>
          <LoadingButton
            loading={status === WalletStatusEnums.LOADING}
            variant="contained"
            color={connected ? "secondary" : "primary"}
            onClick={handleButtonClick}
          >
            {connected ? "Disconnect" : "Connect"}
          </LoadingButton>
        </Toolbar>
      </AppBar>
      {status === WalletStatusEnums.NOT_FOUND && (
        <Alert severity="error" sx={{ marginBottom: 1 }}>
          <AlertTitle>Wallet Not Found</AlertTitle>
          <p>
            Please install and enable either the Argent X or Braavos wallet to use this app.
          </p>
        </Alert>
      )}
      {status === WalletStatusEnums.WRONG_NETWORK && (
        <Alert severity="warning" sx={{ marginBottom: 1 }}>
          <AlertTitle>Connected to the Wrong network</AlertTitle>
          Contract not deployed to this network (chainId {provider.chainId})
          <br />
          <br />
          Please switch to either:
          <ol>
            <li>
              localhost
            </li>
            <li>Starknet testnet network</li>
          </ol>
        </Alert>
      )}
    </>
  );
}

export { Header }
