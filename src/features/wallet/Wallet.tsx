import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { connect, disconnect, selectWallet,  WalletStatusEnums } from './walletSlice';
import { Alert, AlertTitle, Button, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

function WalletStatus() {
  const { provider, status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();

  let display;
  console.log("provider", provider);
  if (provider === null) {
    display = (
      <div>
        {(status === WalletStatusEnums.NOT_FOUND) &&
          <Grid container>
            <Alert severity="error">
              <AlertTitle>Wallet Not Found</AlertTitle>
              <p>
                Please install and enable either the Argent X or Braavos wallet to use this app.
              </p>
            </Alert>
          </Grid>
        }
      </div>
    );
  }

  if (status === WalletStatusEnums.WRONG_NETWORK) {
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
  const { address, chainId, status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();

  <LoadingButton
  loading={status === WalletStatusEnums.LOADING}
  variant="contained"
  onClick={() => dispatch(connect())}
>
  Connect
</LoadingButton>

  const connected = status === WalletStatusEnums.CONNECTED;
  return (
    <Typography
      component={'div'}
      variant="body2"
      color="text.secondary"
      align="center"
      gutterBottom
    >
      <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center"
            rowSpacing={1} columnSpacing={3}>
        {!connected && (
          <Grid item xs={5}>
            <LoadingButton
              loading={status === WalletStatusEnums.LOADING}
              variant="contained"
              onClick={() => dispatch(connect())}
            >
              Connect
            </LoadingButton>
          </Grid>
        )}
        {connected && (
          <Grid item xs={5}>
            <Button
              variant="contained"
              onClick={() => dispatch(disconnect())}
            >
              Disconnect
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
          Status: {WalletStatusEnums[status]}
        </Grid>
        {connected && (
          <Grid>
            <Grid item xs={12}>
              Address: {address.slice(0, 6) + "..." + address.slice(-4)}
            </Grid>
            <Grid item xs={12}>
              Chain: {chainId}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Typography>
  );
}

export { WalletStatus, Footer }
