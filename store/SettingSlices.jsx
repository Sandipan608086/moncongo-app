import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    pageList: [],
    pageDetails: {},
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const pageListApi = createAsyncThunk('pageListApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_global_ext_pages`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})
export const pageDetailsApi = createAsyncThunk('pageDetailsApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_global_ext_slug?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const notificationApiOff = createAsyncThunk('notificationApiOff', async (e) => {
    let bodyContent = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}notification_status`, {
        method: "POST",
        headers: headersList,
        body: bodyContent
    });
    let data = await response.text();
    return JSON.parse(data)
})

const SettingSlices = createSlice({
    name: "Setting",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(pageListApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(pageListApi.fulfilled, (state, action) => {
            state.loading = false
            state.pageList = action.payload.data
            state.error = ''
        })
        builder.addCase(pageListApi.rejected, (state, action) => {
            state.loading = false
            state.pageList = {}
            state.error = action.error.message
        })

        builder.addCase(pageDetailsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(pageDetailsApi.fulfilled, (state, action) => {
            state.loading = false
            state.pageDetails = action.payload.data
            state.error = ''
        })
        builder.addCase(pageDetailsApi.rejected, (state, action) => {
            state.loading = false
            state.pageDetails = {}
            state.error = action.error.message
        })
    }
})

export default SettingSlices.reducer;