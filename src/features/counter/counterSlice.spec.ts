import counterReducer, {
  CounterState,
} from './counterSlice';

describe('counter reducer', () => {
  const initialState: CounterState = {
    balance: 3,
    contract: null,
    status: 'idle',
  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      balance: 0,
      status: 'idle',
    });
  });

});
