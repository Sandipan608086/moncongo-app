import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    jobs: [],
    jobsDetail: {},
    jobsList: [],
    category: [],
    form: {},
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const jobsApi = createAsyncThunk('jobsApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_jobs_list?page=${e.page}&categoryId=${e.categoryId}&type=${e.type}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return { api: JSON.parse(data), page: e.page }
})

export const jobsDetailApi = createAsyncThunk('jobsDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_jobs_data?slug=${e.slug}`, {
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

export const jobsCategory = createAsyncThunk('jobsCategory', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_jobs_category`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const jobsOther = createAsyncThunk('jobsOther', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_jobs_list_data`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).filter(object => { return object.job_slug !== e.slug })
})

export const jobsForm = createAsyncThunk('jobsForm', async (e) => {
    let bodyContent = JSON.stringify({
        "data": e
    });
    let response = await fetch(`${APIURL.BASEURL}web_jobs_form`, {
        method: "POST",
        headers: headersList,
        body: bodyContent
    });
    let data = await response.text();
    return JSON.parse(data)
})

const jobsSlices = createSlice({
    name: "Jobs",
    initialState,
    extraReducers: (builder) => {
        // Tender List
        builder.addCase(jobsApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(jobsApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.page != 1) {
                if (action.payload.api.totalRow !== state.jobs.length) {
                    state.jobs.push(...action.payload.api.data)
                }
            } else {
                state.jobs = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(jobsApi.rejected, (state, action) => {
            state.loading = false
            state.jobs = []
            state.error = action.error.message
        })
        // Tender Details
        builder.addCase(jobsDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(jobsDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.jobsDetail = action.payload
            state.error = ''
        })
        builder.addCase(jobsDetailApi.rejected, (state, action) => {
            state.loading = false
            state.jobsDetail = {}
            state.error = action.error.message
        })
        // Tender Other List
        builder.addCase(jobsOther.fulfilled, (state, action) => {
            state.loading = false
            state.jobsList = action.payload
            state.error = ''
        })
        // Tender Category
        builder.addCase(jobsCategory.pending, (state) => {
            state.loading = true
        })
        builder.addCase(jobsCategory.fulfilled, (state, action) => {
            state.loading = false
            state.category = action.payload
            state.error = ''
        })
        builder.addCase(jobsCategory.rejected, (state, action) => {
            state.loading = false
            state.category = []
            state.error = action.error.message
        })
        // Tender Form List
        builder.addCase(jobsForm.pending, (state) => {
            state.loading = true
        })
        builder.addCase(jobsForm.fulfilled, (state, action) => {
            state.loading = false
            state.form = action.payload
            state.error = ''
        })
        builder.addCase(jobsForm.rejected, (state, action) => {
            state.loading = false
            state.form = {}
            state.error = action.error.message
        })
    }
});

export default jobsSlices.reducer;
