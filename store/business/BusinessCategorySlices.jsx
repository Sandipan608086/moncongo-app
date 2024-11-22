import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "../Api";

const initialState = {
  loading: false,
  category: [],
  error: ''
}
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Authorization": `${APIURL.AUTH}`,
  "Content-Type": "application/json"
}
export const businessCategoryApi = createAsyncThunk('business/businessCategoryApi', async (e) => {
  let response = await fetch(`${APIURL.BASEURL}business_web_category_list?page=${e.page}`, {
    method: "GET",
    headers: headersList
  });
  let data = await response.text();
  return { api: JSON.parse(data), page: e.page }
})

const businessSlices = createSlice({
  name: "businessCategory",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(businessCategoryApi.pending, (state) => {
      state.loading = true
    })
    builder.addCase(businessCategoryApi.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.page != 1) {
        if (action.payload.api.totalRow !== state.category.length) {
          state.category.push(...action.payload.api.data)
        }
      } else {
        state.category = action.payload.api.data
      }
      state.error = ''
    })
    builder.addCase(businessCategoryApi.rejected, (state, action) => {
      state.loading = false
      state.category = []
      state.error = action.error.message
    })
  }
});


export default businessSlices.reducer;
