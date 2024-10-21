import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    announcement: '',
    announcementDetail: {},
    business: {},
    announcementList: [],
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const announcementsApi = createAsyncThunk('announcementsApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_announcement?page=${e.page}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const announcementsDetailApi = createAsyncThunk('announcementsDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_announcement_data?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const announcementsOther = createAsyncThunk('announcementsOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_announcement_list`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.ann_slug !== e.slug })
})

const announcementsSlices = createSlice({
    name: "Announcements",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(announcementsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(announcementsApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.announcement.length) {
                    state.announcement.push(...action.payload.api.data)
                }
            } else {
                state.announcement = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(announcementsApi.rejected, (state, action) => {
            state.loading = false
            state.announcement = []
            state.error = action.error.message
        })
        builder.addCase(announcementsDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(announcementsDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.announcementDetail = action.payload
            state.business = action.payload.business
            state.error = ''
        })
        builder.addCase(announcementsDetailApi.rejected, (state, action) => {
            state.loading = false
            state.announcementDetail = {}
            state.error = action.error.message
        })
        builder.addCase(announcementsOther.fulfilled, (state, action) => {
            state.loading = false
            state.announcementList = action.payload
            state.error = ''
        })
    }
});

export default announcementsSlices.reducer;
