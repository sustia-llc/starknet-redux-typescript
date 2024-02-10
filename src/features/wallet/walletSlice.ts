import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createAppAsyncThunk } from '../createAppAsyncThunk';
import { Contract, uint256 } from 'starknet';
import contractAbi from './cairo1_abi.json';

export enum WalletStatusEnums {
  DISCONNECTED,
  LOADING,
  DAPP_PENDING_APPROVAL,
  DAPP_NOT_APPROVED,
  CONNECTED,
  WRONG_NETWORK,
  NOT_FOUND,
}

export interface WalletState {
  provider: any;
  address: string;
  chainId: string;
  balance: string | null;
  status: WalletStatusEnums;
}

export const initialState: WalletState = {
  provider: null,
  address: '',
  chainId: '',
  balance: null,
  status: WalletStatusEnums.DISCONNECTED,
};

export const connect = createAppAsyncThunk(
  'wallet/connect',
  async (_, { dispatch }) => {
    await dispatch(connectWallet());
    await dispatch(fetchAccount())
      .unwrap()
      .catch((error) => {
        throw error;
    });
    await dispatch(fetchBalance());
  }
);

export const connectWallet = createAppAsyncThunk(
  'wallet/connectWallet', async (_, { dispatch }) => {

  let starknetWindowObject = undefined;
  if (window.starknet_argentX?.version) {
    starknetWindowObject = window.starknet_argentX;
  } else if (window.starknet_braavos?.version) {
    starknetWindowObject = window.starknet_braavos;
  }

  if (!starknetWindowObject) {
    console.log('No wallet found');
    return {
      provider: null,
      status: WalletStatusEnums.NOT_FOUND,
    };
  }

  starknetWindowObject = starknetWindowObject as any;
  console.log("starknetWindowObject", starknetWindowObject);

  console.log("requesting access to wallet");
  try {
    await starknetWindowObject?.enable();
  } catch (error) {
    if (error === "Error: User aborted") {
      console.log('User aborted');
      return {
        provider: null,
        status: WalletStatusEnums.DAPP_NOT_APPROVED,
      };
    }
    console.log('Wallet enable failed: ', error);
    throw error;
  }
  console.log("access granted");
  const provider = starknetWindowObject?.provider;
  console.log("provider {}", provider);

  const account = starknetWindowObject?.account;
  console.log("account {}", account);

  // Subscribe to accounts change
  starknetWindowObject.on('accountsChanged', (accounts: string[]) => {
    console.log('accounts changed:');
    console.log(accounts);
  });

  // Subscribe to chainId change, including locked wallet
  starknetWindowObject.on('networkChanged', (chainId: string) => {
    if (!chainId) {
      console.log('Wallet disconnected');
      dispatch(disconnect());
    } else {
      console.log('Web3 chainChanged:');
      console.log(chainId);
      dispatch(fetchAccount());
    }
  });

  console.log(provider);
  console.log('Connected to wallet');

  return {
    provider,
    status: WalletStatusEnums.LOADING,
  };

});

export const fetchAccount = createAppAsyncThunk(
  'wallet/fetchAccount', async (_, thunkAPI) => {
  const wallet_status = thunkAPI.getState().wallet.status;
  console.log('wallet status:', WalletStatusEnums[wallet_status]);
  if (
    wallet_status === WalletStatusEnums.DAPP_NOT_APPROVED ||
    wallet_status === WalletStatusEnums.NOT_FOUND ||
    wallet_status === WalletStatusEnums.DISCONNECTED
  ) {
    return {
      address: '',
      chainId: '',
      // balance: BigNumber.from(0),
      status: wallet_status,
    };
  }

  let starknetWindowObject = undefined;
  if (window.starknet_argentX?.version) {
    starknetWindowObject = window.starknet_argentX;
  } else if (window.starknet_braavos?.version) {
    starknetWindowObject = window.starknet_braavos;
  }

  starknetWindowObject = starknetWindowObject as any;
  console.log("starknetWindowObject {}", starknetWindowObject);
  console.log('Fetching account address');

  if (!starknetWindowObject) {
    throw new Error('starknetWindowObject not initialized');
  }

  const account = starknetWindowObject?.account;
  console.log("account {}", account);

  const address = account.address;
  console.log('Fetched account:', address);
  if (!address) {
    throw new Error('Address not found');
  } 

  const chainId = starknetWindowObject?.chainId;
  console.log("chainId {}", chainId);

  return {
    address,
    chainId,
    status: WalletStatusEnums.CONNECTED,
  };
});

export const disconnect = createAppAsyncThunk('wallet/disconnect', async (_, thunkAPI) => {
  console.log('disconnecting');

  return {
    provider: null,
    address: '',
    chainId: '',
    status: WalletStatusEnums.DISCONNECTED,
  };
});

export const fetchBalance = createAppAsyncThunk(
  'wallet/fetchBalance', async (_, thunkAPI) => {
  console.log('fetching');
  const { provider } = thunkAPI.getState().wallet;

  let contract = null;
  let balance = '0';

  if (provider) {
    // TODO: Get contract address by Network, currently alpha goerli
    const contractAddress = "0x028ce960c0662945668e53f96b122ac9a2a5cdf88c03d20a785dc1c8b8329f5e";

    if (contractAddress !== undefined) {
      contract = new Contract(
        contractAbi,
        contractAddress,
        provider
      );
      console.log('Contract:', contract); 

      try {
        const contractBalanceResult = await contract.call("get_balance");
        balance = BigInt(contractBalanceResult.valueOf() as bigint).toString();
      } catch (error) {
        console.log('Error fetching balance:', error);
        throw error;
      }
    } else {
      throw new Error('No contract address found for this chain');
    }
  } else {
    console.log('No web3 or provider');
    throw new Error('No web3 or provider');
  }

  return {
    contract,
    balance
  };
});

export const walletSlice = createSlice({
  name: 'WalletReducer',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateStatus: (state, action: PayloadAction<WalletStatusEnums>) => {
      state.status = action.payload;
    },
    disconnectWallet: (state) => {
      state.status = WalletStatusEnums.DISCONNECTED;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectWallet.pending, (state) => {
        console.log('attempting to connect wallet');
        state.status = WalletStatusEnums.LOADING;
      })
      .addCase(connectWallet.fulfilled, (state, { payload }) => {
        console.log('wallet connect success' + payload.status);
        state.provider = payload.provider;
        state.status = payload.status;
      })
      .addCase(connectWallet.rejected, (state) => {
        console.log('provider connect failed, setting to disconnected');
        state.status = WalletStatusEnums.DISCONNECTED;
      })
      .addCase(fetchAccount.fulfilled, (state, { payload }) => {
        state.address = payload.address;
        state.chainId = payload.chainId;
        state.status = payload.status;
      })
      .addCase(fetchAccount.rejected, (state, { payload }) => {
        console.log('fetch account failed, setting to disconnected');
        state.status = WalletStatusEnums.DISCONNECTED;
      })
      .addCase(fetchBalance.fulfilled, (state, { payload }) => {
        state.balance = payload.balance;
      })
      .addCase(disconnect.rejected, (state) => {
        console.log('disconnect failed');
      })
      .addCase(disconnect.fulfilled, (state, { payload }) => {
        state.provider = payload.provider;
        state.chainId = payload.chainId;
        state.status = payload.status;
      });
  },
});

export const { updateStatus, disconnectWallet } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet;
export const selectWalletStatus = (state: RootState) => state.wallet.status;

export default walletSlice.reducer;
