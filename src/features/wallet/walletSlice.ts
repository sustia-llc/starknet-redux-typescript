import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Account, constants, Provider } from 'starknet';
import { fetchBalance } from '../counter/counterSlice';

type AsyncThunkConfig = {
  state: RootState;
  dispatch?: Dispatch<AnyAction>;
  extra?: unknown;
  rejectValue?: unknown;
};

export const connectWallet = createAsyncThunk<void, void, AsyncThunkConfig>(
  'ConnectWallet',
  async (action, { dispatch }) => {
    await dispatch(initWeb3());
    await dispatch(fetchAccount())
      .unwrap()
      .catch((error) => {
        throw error;
    });
    await dispatch(fetchBalance());
  }
);

export const initWeb3 = createAsyncThunk<
  {
    provider: any;
    status: WalletStatusEnums;
  },
  void,
  AsyncThunkConfig
>('InitWeb3', async (action, { dispatch }) => {

  try {
    let starknetWindowObject = undefined;
    if (window.starknet_argentX?.version) {
      starknetWindowObject = window.starknet_argentX;
    } else if (window.starknet_braavos?.version) {
      starknetWindowObject = window.starknet_braavos;
    }
    //if starknetWindowObject is undefined, update status with WALLET_NOT_FOUND
    if (!starknetWindowObject) {
      console.log('No wallet found');
      return {
        provider: null,
        status: WalletStatusEnums.WALLET_NOT_FOUND,
      };
    }

    starknetWindowObject = starknetWindowObject as any;
    console.log("version {}", starknetWindowObject.version);

    await starknetWindowObject?.enable();
    const provider = starknetWindowObject?.account;
    console.log("provider {}", provider);

    // Subscribe to accounts change
    starknetWindowObject.on('accountsChanged', (accounts: string[]) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    starknetWindowObject.on('networkChanged', (chainId: string) => {
      console.log('Web3 chainChanged:');
      console.log(chainId);
      dispatch(fetchAccount());
    });

    // // Subscribe to session disconnection
    // starknetWindowObject.on('disconnect', (code: number, reason: string) => {
    //   console.log('Web3 disconnect:');
    //   console.log(code, reason);
    // });
    console.log(provider);
    console.log('Connected to wallet');

    return {
      provider,
      status: WalletStatusEnums.LOADING,
    };
  } catch (error) {
    console.log('Error initializing web3', error);
    throw error;
  }
});

export const fetchAccount = createAsyncThunk<
  {
    address: string;
    // balance: BigNumber;
    status: WalletStatusEnums;
  },
  void,
  AsyncThunkConfig
>('FetchAccount', async (_, thunkAPI) => {
  try {
    // log wallet status
    console.log('wallet status:', WalletStatusEnums[thunkAPI.getState().wallet.status]);
    // if status is WALLET_NOT_FOUND, return
    if (thunkAPI.getState().wallet.status === WalletStatusEnums.WALLET_NOT_FOUND) {
      return {
        address: '',
        // balance: BigNumber.from(0),
        status: WalletStatusEnums.WALLET_NOT_FOUND,
      };
    }

    const provider = thunkAPI.getState().wallet.provider;
    console.log('Fetching account address');

    if (!provider) {
      throw new Error('provider not initialized');
    }
    
    const signer = provider.signer;
    console.log(signer);
    const address = provider.address;
    console.log('Fetched account:', address);
    if (!address) throw 'Account disconnected';
    // const balance = await provider.signer.get .getBalance(address);
    // console.log('balance:', balance);

    return {
      address,
      // balance: balance,
      status: WalletStatusEnums.CONNECTED,
    };
  } catch (error) {
    console.log('Error fetching account address', error);
    throw error;
  }
});

export const disconnect = createAsyncThunk<
  { provider: null; status: WalletStatusEnums },
  void,
  AsyncThunkConfig
>('Disconnect', async (_, thunkAPI) => {
  console.log('disconnecting');
  window.location.reload();

  return {
    provider: null,
    address: '',
    status: WalletStatusEnums.DISCONNECTED,
  };
});

export enum WalletStatusEnums {
  DISCONNECTED,
  LOADING,
  CONNECTED,
  WRONG_NETWORK,
  WALLET_NOT_FOUND,
}

export interface WalletState {
  provider: any;
  address: string;
  // balance: BigNumber | null;
  status: WalletStatusEnums;
  blockNumber: number | null;
}

export const initialState: WalletState = {
  provider: null,
  address: '',
  // balance: null,
  status: WalletStatusEnums.DISCONNECTED,
  blockNumber: null
};

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
      .addCase(initWeb3.fulfilled, (state, { payload }) => {
        console.log('initWeb3 success' + payload.status);
        state.provider = payload.provider;
        state.status = payload.status;
      })
      .addCase(initWeb3.rejected, (state) => {
        console.log('initWeb3 failed, setting to disconnected');
        state.status = WalletStatusEnums.DISCONNECTED;
      })
      .addCase(fetchAccount.fulfilled, (state, { payload }) => {
        state.address = payload.address;
        // state.balance = payload.balance;
        state.status = payload.status;
      })
      .addCase(disconnect.rejected, (state) => {
        console.log('disconnect failed');
      })
      .addCase(disconnect.fulfilled, (state, { payload }) => {
        state.provider = payload.provider;
        state.status = payload.status;
      });
  },
});

export const { updateStatus, disconnectWallet } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet;
export const selectWalletStatus = (state: RootState) => state.wallet.status;

export default walletSlice.reducer;
