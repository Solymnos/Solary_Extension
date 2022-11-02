import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import statusReducer from '../feature/statusSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const userDataPersistConfig = 
{
    key : 'user',
    storage : storage,
};

export const store = configureStore({
    reducer : {
        status : persistReducer(userDataPersistConfig, statusReducer),
    }
});

getDefaultMiddleware({
    serializableCheck: false,
});