import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { connectWallet, disconnect, selectWallet,  WalletStatusEnums } from './walletSlice';
import { Alert, AlertTitle, Button, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function Wallet() {
  const { address, provider, status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();

  let display;

  if (provider == null) {
    display = (
      <div>
        {(status === WalletStatusEnums.WALLET_NOT_FOUND) &&
          <Grid container>
            <Alert severity="error">
              <AlertTitle>Wallet Not Found</AlertTitle>
              <p>
                Please install and enable either the Argent X or Braavos wallet to use this app.
              </p>
            </Alert>
          </Grid>
        }

        <LoadingButton
          loading={status === WalletStatusEnums.LOADING}
          variant="contained"
          onClick={() => dispatch(connectWallet())}
        >
          Connect
        </LoadingButton>
      </div>
    );
  }

  if (status === WalletStatusEnums.CONNECTED) {
    display = (
      <Grid container>
        <div>
          <p>Connected to {provider?.chainId}</p>
          <p>Account: {address}</p>
        </div>
      </Grid>
    );
  } else if (status === WalletStatusEnums.WRONG_NETWORK) {
    display = (
      <Grid container>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Contract not deployed to this network (chainId {provider.chainId})
          <br />
          <br />
          Please switch to either:
          <ol>
            <li>
              localhost with chainId: FIXME (make sure the hardhat node is
              running)
            </li>
            <li>Starknet testnet network</li>
          </ol>
        </Alert>
      </Grid>
    );
  }

  return <div>{display}</div>;
}

function Footer() {
  const { address, status, blockNumber } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();

  const connected = status === WalletStatusEnums.CONNECTED;
  return (
    <Typography
      component={'div'}
      variant="body2"
      color="text.secondary"
      align="center"
      gutterBottom
    >
      <Grid container rowSpacing={1} columnSpacing={3}>
        {!connected && (
          <Grid item xs={12}>
            Status: {WalletStatusEnums[status]}
          </Grid>
        )}
        {connected && (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={5}>
              <Button
                variant="contained"
                onClick={() => dispatch(disconnect())}
              >
                Disconnect
              </Button>
            </Grid>
          </Grid>
        )}
        {connected && (
          <Grid>
            <Grid item xs={12}>
              {address}
            </Grid>
            <Grid item xs={12}>
              Block Number: {blockNumber}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Typography>
  );
}

export { Wallet, Footer}
