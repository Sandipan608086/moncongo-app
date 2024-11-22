import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    event: '',
    eventsDetail: {},
    business: {},
    eventList: [],
    category: [],
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const eventsApi = createAsyncThunk('eventsApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_events_list?page=${e.page}&categoryId=${e.categoryId}&type=${e.type}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const eventsDetailApi = createAsyncThunk('eventsDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_events_data?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const eventsSearchApi = createAsyncThunk('eventsSearchApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_events_search?page=${e.page}&categoryId=${e.categoryId}&date=${e.date}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const eventsCategory = createAsyncThunk('eventsCategory', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_events_category`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const eventsOther = createAsyncThunk('eventsOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_events_list_data`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.event_slug !== e.slug })
})

const eventSlices = createSlice({
    name: "Events",
    initialState,
    extraReducers: (builder) => {
        // Event List
        builder.addCase(eventsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(eventsApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.event.length) {
                    state.event.push(...action.payload.api.data)
                }
            } else {
                state.event = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(eventsApi.rejected, (state, action) => {
            state.loading = false
            state.event = []
            state.error = action.error.message
        })
        // Event Details
        builder.addCase(eventsDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(eventsDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.eventsDetail = action.payload
            state.business = action.payload.business
            state.error = ''
        })
        builder.addCase(eventsDetailApi.rejected, (state, action) => {
            state.loading = false
            state.eventsDetail = {}
            state.error = action.error.message
        })
        // Event Other
        builder.addCase(eventsOther.fulfilled, (state, action) => {
            state.loading = false
            state.eventList = action.payload
            state.error = ''
        })
        // Event Category
        builder.addCase(eventsCategory.pending, (state) => {
            state.loading = true
        })
        builder.addCase(eventsCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload
            state.error = ''
        })
        builder.addCase(eventsCategory.rejected, (state, action) => {
            state.loading = false
            state.category = []
            state.error = action.error.message
        })
    }
});


export default eventSlices.reducer;
