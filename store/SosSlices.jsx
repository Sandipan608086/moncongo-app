import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    sos: [],
    error: ''
}

const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}

export const sosApi = createAsyncThunk('sosApi', async () => {
    let response = await fetch(`${APIURL.BASEURL}web_sos_list?page=1`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

const sosSlices = createSlice({
    name: "Sos",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(sosApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(sosApi.fulfilled, (state, action) => {
            state.loading = false
            state.sos = action.payload.data ?? []
            state.error = ''
        })
        builder.addCase(sosApi.rejected, (state, action) => {
            state.loading = false
            state.sos = []
            state.error = action.error.message
        })
    }
});

export default sosSlices.reducer;
