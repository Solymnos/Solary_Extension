import { configureStore } from '@reduxjs/toolkit';
import statusReducer from '../feature/statusSlice';

export const store = configureStore({
    reducer : {
        status : statusReducer,
    }
});