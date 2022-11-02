import { createSlice } from '@reduxjs/toolkit';

export const statusSlice = createSlice({
    name : 'status',
    initialState : {
        status : 'NOT_LOG_ON_TWITCH',
        notification : true,
    },
    reducers : {
        updateStatus: (state, { payload }) => {
            state.status = payload;
        },
        changeNotificationStatus : (state, { payload }) => {
            state.notification = payload;
        },
    },
});

export const { updateStatus, changeNotificationStatus } = statusSlice.actions;
export default statusSlice.reducer;