import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    coupons: [],
    couponsDetail: {},
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const couponsApi = createAsyncThunk('couponsApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_coupons_list?page=${e.page}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const couponsDetailApi = createAsyncThunk('couponsDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_coupons_data?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const couponsOtpApi = createAsyncThunk('couponsOtpApi', async (e) => {
    let json = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}web_coupons_chake?json=${json}`, {
        method: "POST",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

const couponsSlices = createSlice({
    name: "Coupons",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(couponsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(couponsApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.coupons.length) {
                    state.coupons.push(...action.payload.api.data)
                }
            } else {
                state.coupons = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(couponsApi.rejected, (state, action) => {
            state.loading = false
            state.coupons = []
            state.error = action.error.message
        })
        builder.addCase(couponsDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(couponsDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.couponsDetail = action.payload
            state.error = ''
        })
        builder.addCase(couponsDetailApi.rejected, (state, action) => {
            state.loading = false
            state.couponsDetail = {}
            state.error = action.error.message
        })
    }
});

export default couponsSlices.reducer;
