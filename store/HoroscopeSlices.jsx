import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    horoscope: [],
    horoscopeDetail: {},
    horoscopeList: [],
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const horoscopeApi = createAsyncThunk('horoscopeApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_horoscope_list?page=${e.page}`, { 
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const horoscopeDetailApi = createAsyncThunk('horoscopeDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_horoscope_data?slug=${e.slug}`, { 
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const horoscopeOther = createAsyncThunk('horoscopeOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_horoscope_list_data`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.horo_slug !== e.slug })
})

const horoscopeSlices = createSlice({
    name: "Horoscope",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(horoscopeApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(horoscopeApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.horoscope.length) {
                    state.horoscope.push(...action.payload.api.data)
                }
            } else {
                state.horoscope = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(horoscopeApi.rejected, (state, action) => {
            state.loading = false
            state.horoscope = []
            state.error = action.error.message
        })
        builder.addCase(horoscopeDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(horoscopeDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.horoscopeDetail = action.payload
            state.error = ''
        })
        builder.addCase(horoscopeDetailApi.rejected, (state, action) => {
            state.loading = false
            state.horoscopeDetail = {}
            state.error = action.error.message
        })
        builder.addCase(horoscopeOther.fulfilled, (state, action) => {
            state.loading = false
            state.horoscopeList = action.payload
            state.error = ''
        })
    }
});

export default horoscopeSlices.reducer;
