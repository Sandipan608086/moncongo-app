import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    tenders: [],
    tendersDetail: {},
    tendersList: [],
    category: [],
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const tendersApi = createAsyncThunk('tendersApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_tenders_list?page=${e.page}&categoryId=${e.categoryId}&type=${e.type}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const tendersDetailApi = createAsyncThunk('tendersDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_tenders_data?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

// export const tendersSearchApi = createAsyncThunk('tendersSearchApi', async (e) => {
//     let response = await fetch(`${APIURL.BASEURL}web_events_search?page=${e.page}&categoryId=${e.categoryId}&date=${e.date}`, {
//         method: "GET",
//         headers: headersList
//     });
//     let data = await response.text();
//     return JSON.parse(data)
// })

export const tendersCategory = createAsyncThunk('tendersCategory', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_tenders_category`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const tendersOther = createAsyncThunk('tendersOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_tenders_list_data`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.tender_slug !== e.slug })
})

const tendersSlices = createSlice({
    name: "Tenders",
    initialState,
    extraReducers: (builder) => {
        // Tender List
        builder.addCase(tendersApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(tendersApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.tenders.length) {
                    state.tenders.push(...action.payload.api.data)
                }
            } else {
                state.tenders = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(tendersApi.rejected, (state, action) => {
            state.loading = false
            state.tenders = []
            state.error = action.error.message
        })
        // Tender Details
        builder.addCase(tendersDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(tendersDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.tendersDetail = action.payload
            state.error = ''
        })
        builder.addCase(tendersDetailApi.rejected, (state, action) => {
            state.loading = false
            state.tendersDetail = {}
            state.error = action.error.message
        })
        // Tender Other List
        builder.addCase(tendersOther.fulfilled, (state, action) => {
            state.loading = false
            state.tendersList = action.payload
            state.error = ''
        })
        // Tender Category
        builder.addCase(tendersCategory.pending, (state) => {
            state.loading = true
        })
        builder.addCase(tendersCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload
            state.error = ''
        })
        builder.addCase(tendersCategory.rejected, (state, action) => {
            state.loading = false
            state.category = []
            state.error = action.error.message
        })
    }
});

export default tendersSlices.reducer;
