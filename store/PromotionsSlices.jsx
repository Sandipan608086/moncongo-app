import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    promotions: '',
    promotionsDetail: {},
    business: {},
    promotionsList: [],
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const promotionsApi = createAsyncThunk('promotionsApi', async (e) => {
    let bodyContent = JSON.stringify({
        "page": e.page
    });
    let response = await fetch(`${APIURL.BASEURL}web_promotions`, { 
        method: "POST",
        body: bodyContent,
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const promotionsDetailApi = createAsyncThunk('promotionsDetailApi', async (e) => {
    let bodyContent = JSON.stringify({
        "slug": e.slug
    });
    let response = await fetch(`${APIURL.BASEURL}web_promotions_data`, { 
        method: "POST",
        body: bodyContent,
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const promotionsOther = createAsyncThunk('promotionsOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_promotions_list`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.prom_slug !== e.slug })
})

const promotionSlices = createSlice({
    name: "Promotions",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(promotionsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(promotionsApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.promotions.length) {
                    state.promotions.push(...action.payload.api.data)
                }
            } else {
                state.promotions = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(promotionsApi.rejected, (state, action) => {
            state.loading = false
            state.promotions = []
            state.error = action.error.message
        })
        builder.addCase(promotionsDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(promotionsDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.promotionsDetail = action.payload
            state.business = action.payload.business
            state.error = ''
        })
        builder.addCase(promotionsDetailApi.rejected, (state, action) => {
            state.loading = false
            state.promotionsDetail = {}
            state.error = action.error.message
        })
        builder.addCase(promotionsOther.fulfilled, (state, action) => {
            state.loading = false
            state.promotionsList = action.payload
            state.error = ''
        })
    }
});

export default promotionSlices.reducer;
