import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    news: [],
    newsDetail: {},
    newsList: [],
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const newsApi = createAsyncThunk('newsApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_news_list?page=${e.page}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const newsDetailApi = createAsyncThunk('newsDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_news_data?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const newsOther = createAsyncThunk('newsOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_news_data_list`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.news_slug !== e.slug })
})

const newsSlices = createSlice({
    name: "News",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(newsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(newsApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.news.length) {
                    state.news.push(...action.payload.api.data)
                }
            } else {
                state.news = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(newsApi.rejected, (state, action) => {
            state.loading = false
            state.news = []
            state.error = action.error.message
        })

        builder.addCase(newsDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(newsDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.newsDetail = action.payload
            state.error = ''
        })
        builder.addCase(newsDetailApi.rejected, (state, action) => {
            state.loading = false
            state.newsDetail = {}
            state.error = action.error.message
        })

        builder.addCase(newsOther.fulfilled, (state, action) => {
            state.loading = false
            state.newsList = action.payload
            state.error = ''
        })
    }
});

export default newsSlices.reducer;
