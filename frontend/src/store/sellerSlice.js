import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  seller: null,
};

export const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    setSellerDetails: (state, action) => {
      state.seller = action.payload;
    },
    clearSellerDetails: (state) => {
      state.seller = null;
    },
  },
});

// Export actions to be used in components or context
export const { setSellerDetails, clearSellerDetails } = sellerSlice.actions;

export default sellerSlice.reducer;
