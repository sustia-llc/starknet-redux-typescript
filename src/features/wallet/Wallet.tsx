import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectWallet, connectWallet, WalletStatusEnums } from './walletSlice';

function Wallet() {
  const { provider, status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();

  let display;

  if (provider == null) {
    // loading={status == WalletStatusEnums.LOADING}
    display = (
      <div>Wallet:
        <button
          onClick={() => dispatch(connectWallet())}
        >
          Connect
        </button>
      </div>
    );
  }

  if (status === WalletStatusEnums.CONNECTED) {
    display = (
      <div>Wallet:
        <p>Connected to {provider?.chainId}</p>
        <p>Account: {provider?.account}</p>
      </div>
    );
  } else if (status === WalletStatusEnums.WRONG_NETWORK) {
    display = (
      <div>Wallet:
        <p>Wrong network</p>
      </div>
    );
  }

  return <div>{display}</div>;
}

export default Wallet;
