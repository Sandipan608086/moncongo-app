import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    notification: '',
    tokenNot: '',
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}

export const notificatioToken = createAsyncThunk('notificatioToken', async (e) => {
    return e
})

export const notificationApi = createAsyncThunk('notificationApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}mobile_notification_show?page=${e.page}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const notificationTestApi = createAsyncThunk('notificationTestApi', async (e) => {
    let bodyContent = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}add_log`, {
        method: "POST",
        headers: headersList,
        body: bodyContent
    });
    let data = await response.text();
    return JSON.parse(data)
})

const notificationSlices = createSlice({
    name: "Notification",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(notificationApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(notificationApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.notification.length) {
                    state.notification.push(...action.payload.api.data)
                }
            } else {
                state.notification = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(notificationApi.rejected, (state, action) => {
            state.loading = false
            state.notification = []
            state.error = action.error.message
        })

        builder.addCase(notificatioToken.fulfilled, (state, action) => {
            state.loading = false
            state.tokenNot = action.payload
            state.error = ''
        })
    }
});

export default notificationSlices.reducer;