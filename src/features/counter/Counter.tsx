import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  increment,
  selectCount,
} from './counterSlice';
import { WalletStatusEnums, selectWallet } from '../wallet/walletSlice';
import { Box, Button, TextField, Typography } from '@mui/material';

export function Counter() {
  const count = useAppSelector(selectCount);
  const { status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const handleIncrement = () => {
    const amount = parseInt(incrementAmount, 10);
    if (!isNaN(amount)) {
      dispatch(increment({ amount }));
    }
  };

  if (status === WalletStatusEnums.CONNECTED) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h5" component="div" sx={{ marginBottom: 1 }}>
        Current Count: {count}
      </Typography>
      <TextField
        label="Increment Amount"
        value={incrementAmount}
        onChange={(e) => setIncrementAmount(e.target.value)}
        type="number"
        sx={{ marginBottom: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleIncrement}>
        Increment
      </Button>
    </Box>
    );
  } else {
    return (
      <div></div>
    );
  }
}
