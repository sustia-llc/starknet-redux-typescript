import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  incrementAsync,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';
import { WalletStatusEnums, selectWallet } from '../wallet/walletSlice';

export function Counter() {
  const count = useAppSelector(selectCount);
  const { status } = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;
  if (status === WalletStatusEnums.CONNECTED) {
    return (
      <div>
        <div className={styles.row}>
          Current Count: {count}
        </div>
        <div className={styles.row}>
          <input
            className={styles.textbox}
            aria-label="Set increment amount"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(e.target.value)}
          />
          <button
            className={styles.asyncButton}
            onClick={() => dispatch(incrementAsync(incrementValue))}
          >
            Add
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div></div>
    );
  }
}
