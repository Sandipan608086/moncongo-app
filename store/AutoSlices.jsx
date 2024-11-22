import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    autos: '',
    autoDetail: {},
    autoDetailImg: {},
    autoList: {},
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const autoApi = createAsyncThunk('autoApi', async (e) => {
    if (e.type == true) {
        let response = await fetch(`${APIURL.BASEURL}web_cars_filter_data_mobile?page=${e.page}&json=${e.data}`, {
            method: "POST",
            headers: headersList
        });
        let data = await response.text();
        return { api: JSON.parse(data), page: e.page, type: e.type }
    } else if (e.type == false) {
        let response = await fetch(`${APIURL.BASEURL}web_cars_list_mobile?page=${e.page}`, {
            method: "GET",
            headers: headersList
        });
        let data = await response.text();
        return { api: JSON.parse(data), page: e.page, type: e.type }
    }
})

export const autoDetailApi = createAsyncThunk('autoDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cars_details?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const autoDetailImgApi = createAsyncThunk('autoDetailImgApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}mobile_cars_details_img?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const autoFilterListApi = createAsyncThunk('autoFilterListApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cars_filter_mobile`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const autoFilterDataApi = createAsyncThunk('autoFilterDataApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cars_filter_data?page=${e.page}&json=${e.data}`, {
        method: "post",
        headers: headersList,
    });
    let data = await response.text();
    return JSON.parse(data)
})

const autoSlices = createSlice({
    name: "Auto",
    initialState,
    extraReducers: (builder) => {
        // Auto List
        builder.addCase(autoApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(autoApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.type === false) {
                if (action.payload.page != 1) {
                    if (action.payload.api.totalRow !== state.autos.length) {
                        state.autos.push(...action.payload.api.data)
                    }
                } else {
                    state.autos = action.payload.api.data
                }
            } else {
                state.autos = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(autoApi.rejected, (state, action) => {
            state.loading = false
            state.autos = []
            state.error = action.error.message
        })
        // Auto Details
        builder.addCase(autoDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(autoDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.autoDetail = action.payload.data
            state.error = ''
        })
        builder.addCase(autoDetailApi.rejected, (state, action) => {
            state.loading = false
            state.autoDetail = {}
            state.error = action.error.message
        })
        // Auto User Details Img
        builder.addCase(autoDetailImgApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(autoDetailImgApi.fulfilled, (state, action) => {
            state.loading = false
            state.autoDetailImg = action.payload.data
            state.error = ''
        })
        builder.addCase(autoDetailImgApi.rejected, (state, action) => {
            state.loading = false
            state.autoDetailImg = {}
            state.error = action.error.message
        })
        // Auto List
        builder.addCase(autoFilterListApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(autoFilterListApi.fulfilled, (state, action) => {
            state.loading = false
            state.autoList = action.payload != null ? action.payload : []
            state.error = ''
        })
        builder.addCase(autoFilterListApi.rejected, (state, action) => {
            state.loading = false
            state.autoList = {}
            state.error = action.error.message
        })
    }
});

export default autoSlices.reducer;
