import { createSlice } from '@reduxjs/toolkit';

export const statusSlice = createSlice({
    name : 'status',
    initialState : {
        status : 'NOT_LOG_ON_TWITCH',
    },
    reducers : {
        updateStatus: (state, { payload }) => {
            state.status = payload;
        },
    },
});

export const { updateStatus } = statusSlice.actions;
export default statusSlice.reducer;