import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import sellerReducer from './sellerSlice'; // Import sellerReducer


export const store = configureStore({
  reducer: {
    user : userReducer,
    seller: sellerReducer, // Add seller reducer here

  },
})



