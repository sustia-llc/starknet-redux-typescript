/* Core */
import { createAsyncThunk } from '@reduxjs/toolkit';

/* Instruments */
import type { AppDispatch, RootState } from '../app/store';

/**
 * ? A utility function to create a typed Async Thunk Actions.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();

/**
 * ? A utility function to handle errors.
 */
export function handleThunkError(error: any, thunkAPI: any) {
  if (error instanceof Error) {
    return thunkAPI.rejectWithValue(error.message);
  }
  return thunkAPI.rejectWithValue('unknown error');
}
