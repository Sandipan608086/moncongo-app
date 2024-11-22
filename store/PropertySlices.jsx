import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    property: '',
    propertyDetail: {},
    propertyDetailImg: {},
    propertyList: {},
    propertyDropdown: {},
    error: ''
}
const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": `${APIURL.AUTH}`,
    "Content-Type": "application/json"
}
export const propertyApi = createAsyncThunk('propertyApi', async (e) => {
    if(e.type == true) {
        console.log(e)
        let response = await fetch(`${APIURL.BASEURL}web_property_filter_data_modile?page=${e.page}&json=${e.data}`, {
            method: "POST",
            headers: headersList,
        });
        let data = await response.text();
        return { api: JSON.parse(data), page: e.page, type: e.type }
    } else if(e.type == false) {
        console.log(e)
        let response = await fetch(`${APIURL.BASEURL}web_property_list_mobile?page=${e.page}`, {
            method: "GET",
            headers: headersList
        });
        let data = await response.text();
        return { api: JSON.parse(data), page: e.page, type: e.type }
    }
})

export const propertyDetailApi = createAsyncThunk('propertyDetailApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_property_details?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})


export const propertyDetailImgApi = createAsyncThunk('propertyDetailImgApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}mobile_property_details_img?slug=${e.slug}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

export const propertyFilterDropdownApi = createAsyncThunk('propertyFilterDropdownApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_property_dropdown_list`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data)
})

const propertySlices = createSlice({
    name: "Property",
    initialState,
    extraReducers: (builder) => {
        // Property List
        builder.addCase(propertyApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(propertyApi.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload.type === false) { 
                if (action.payload.page != 1) {
                    if (action.payload.api.totalRow !== state.property.length) {
                        state.property.push(...action.payload.api.data)
                    }
                } else {
                    state.property = action.payload.api.data
                }
            } else {
                state.property = action.payload.api.data
            }
            state.error = ''
        })
        builder.addCase(propertyApi.rejected, (state, action) => {
            state.loading = false
            state.property = []
            state.error = action.error.message
        })
        // Property Details
        builder.addCase(propertyDetailApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(propertyDetailApi.fulfilled, (state, action) => {
            state.loading = false
            state.propertyDetail = action.payload.data
            state.error = ''
        })
        builder.addCase(propertyDetailApi.rejected, (state, action) => {
            state.loading = false
            state.propertyDetail = {}
            state.error = action.error.message
        })
        // Property User Img Details
        builder.addCase(propertyDetailImgApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(propertyDetailImgApi.fulfilled, (state, action) => {
            state.loading = false
            state.propertyDetailImg = action.payload.data
            state.error = ''
        })
        builder.addCase(propertyDetailImgApi.rejected, (state, action) => {
            state.loading = false
            state.propertyDetailImg = {}
            state.error = action.error.message
        })
        // Property Dropdown
        builder.addCase(propertyFilterDropdownApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(propertyFilterDropdownApi.fulfilled, (state, action) => {
            state.loading = false
            state.propertyDropdown = action.payload != null ? action.payload : []
            state.error = ''
        })
        builder.addCase(propertyFilterDropdownApi.rejected, (state, action) => {
            state.loading = false
            state.propertyDropdown = {}
            state.error = action.error.message
        })
    }
});

export default propertySlices.reducer;
