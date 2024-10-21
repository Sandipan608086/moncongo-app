import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    otherMenu: [],
    otherList: [],
    otherDetail: {},
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const otherMenuApi = createAsyncThunk('otherMenuApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_other_page_menu`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})
export const otherListApi = createAsyncThunk('otherListApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_other_page_list?page=${e.page}&slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})
export const otherDetailApi = createAsyncThunk('otherDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_other_page_details?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})
const otherSlices = createSlice({
    name: "Other",
    initialState,
    extraReducers: (builder) => {
        //Other Menu
        builder.addCase(otherMenuApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(otherMenuApi.fulfilled, (state, action) => {
            state.loading = false
            state.otherMenu = action.payload
            state.error = ''
        })
        builder.addCase(otherMenuApi.rejected, (state, action) => {
            state.loading = false
            state.otherMenu = []
            state.error = action.error.message
        })
        //Other List
        builder.addCase(otherListApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(otherListApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.otherList.length) {
                    state.otherList.push(...action.payload.api.data)
                }
            } else {
                state.otherList = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(otherListApi.rejected, (state, action) => {
            state.loading = false
            state.otherList = []
            state.error = action.error.message
        })
        // Other Detail
        builder.addCase(otherDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(otherDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.otherDetail = action.payload
            state.error = ''
        })
        builder.addCase(otherDetailApi.rejected, (state, action) => {
            state.loading = false
            state.otherDetail = {}
            state.error = action.error.message
        })
    }
});

export default otherSlices.reducer;