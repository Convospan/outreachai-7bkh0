'use server';
import { configureStore, Middleware } from '@reduxjs/toolkit'; // Removed GetDefaultMiddleware, added Middleware
import { thunk, ThunkMiddleware } from 'redux-thunk'; 
import rootReducer from '@/store/reducers'; 
import { UnknownAction, Dispatch } from 'redux'; // Added Dispatch

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(thunk as unknown as Middleware<any, any, Dispatch<UnknownAction>>),
});

export default store;
