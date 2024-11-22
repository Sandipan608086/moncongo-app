import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "../Api";
const initialState = {
  loading: false,
  businesslist: [],
  businesslistPost: [],
  cityfilters: [],
  error: ''
}
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Authorization": `${APIURL.AUTH}`,
  "Content-Type": "application/json"
}
export const businessListApi = createAsyncThunk('business/businessListApi', async (e) => {
  let response = await fetch(`${APIURL.BASEURL}business_web_list?page=${e.page}&cId=${e.cId}&sId=${e.sId}&cityId=${e.cityId}`, {
    method: "GET",
    headers: headersList
  });
  let data = await response.text();
  return { api: JSON.parse(data), page: e.page  }
})

export const businessPostListApi = createAsyncThunk('business/businessPostListApi', async (e) => {
  let response = await fetch(`${APIURL.BASEURL}business_web_post_List?page=${e.page}&id=${e.id}&type=${e.type}`, {
    method: "GET",
    headers: headersList
  });
  let data = await response.text();
  return { api: JSON.parse(data), page: e.page }
})

const businessListSlices = createSlice({
  name: "businesslist",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(businessListApi.pending, (state) => {
      state.loading = true
    })
    builder.addCase(businessListApi.fulfilled, (state, action) => {
      state.loading = false
      if(action.payload.page != 1) {
        if(action.payload.api.totalRow !== state.businesslist.length) {
          state.businesslist.push(...action.payload.api.data)
        }
      } else {
        state.businesslist = action.payload.api.data
      }
      state.cityfilters = action.payload.api.cityfilters
      state.error = ''
    })
    builder.addCase(businessListApi.rejected, (state, action) => {
      state.loading = false
      state.businesslist = []
      state.error = action.error.message
    })

    builder.addCase(businessPostListApi.pending, (state) => {
      state.loading = true
    })
    builder.addCase(businessPostListApi.fulfilled, (state, action) => {
      state.loading = false
      if(action.payload.page != 1) {
        if(action.payload.api.totalRow !== state.businesslistPost.length) {
          state.businesslistPost.push(...action.payload.api.data)
        }
      } else {
        state.businesslistPost = action.payload.api.data
      }
      state.error = ''
    })
    builder.addCase(businessPostListApi.rejected, (state, action) => {
      state.loading = false
      state.businesslistPost = []
      state.error = action.error.message
    })
  }
});


export default businessListSlices.reducer;
