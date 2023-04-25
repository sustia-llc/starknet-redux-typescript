import { AnyAction, createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Contract } from 'starknet';
import contractAbi from './cairo1_abi.json';

export interface CounterState {
  balance: number;
  contract: any;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  balance: 0,
  contract: null,
  status: 'idle',
};

type AsyncThunkConfig = {
  state: RootState;
  dispatch?: Dispatch<AnyAction>;
  extra?: unknown;
  rejectValue?: unknown;
};

export const fetchBalance = createAsyncThunk<
  {
    contract: Contract;
    balance: number;
  },
  void,
  AsyncThunkConfig
>('fetchBalance', async (_, thunkAPI) => {
  console.log('fetching');
  const { provider } = thunkAPI.getState().wallet;

  let contract = null;
  let balance = 0;

  if (provider) {
    // TODO: Get contract address by Network, currently localhost
    const contractAddress = "0x51ed4fb58bccd13e9bc1229e5a740892480584fc3c07405b09d54df63d81baf";

    if (contractAddress !== undefined) {
      contract = new Contract(
        contractAbi,
        contractAddress,
        provider
      );
      console.log('Contract:', contract);

      try {
        const contractBalance = await contract.functions.get_balance();
        balance = Number(contractBalance);
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

export const increment = createAsyncThunk<
  {
    balance: number;
  },
  {
    amount: number;
  },
  AsyncThunkConfig
>('increment', async ({ amount }, thunkAPI) => {
    const { provider } = thunkAPI.getState().wallet;
    const { contract } = thunkAPI.getState().counter;
    let { balance } = thunkAPI.getState().counter;

    if (provider) {
      try {
        let starknetWindowObject = undefined;
        if (window.starknet_argentX?.version) {
          starknetWindowObject = window.starknet_argentX;
        } else if (window.starknet_braavos?.version) {
          starknetWindowObject = window.starknet_braavos;
        }
        starknetWindowObject = starknetWindowObject as any;
        let account = starknetWindowObject?.account;
        contract.connect(account);
        contract.invoke("increase_balance",[amount]);
        balance += 10;
      } catch (error) {
        console.log('Error fetching balance:', error);
        throw error;
      }
    }
    // The value we return becomes the `fulfilled` action payload
    return {
      balance
    };
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.balance = payload.balance;
        state.contract = payload.contract;
      })
      .addCase(increment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(increment.fulfilled, (state, action) => {
        state.status = 'idle';
        state.balance += action.payload.balance;
      })
      .addCase(increment.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectCount = (state: RootState) => state.counter.balance;

export default counterSlice.reducer;
