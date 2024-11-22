import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "../Api";
const initialState = {
  loading: false,
  subcategory: [],
  error: ''
}
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Authorization": `${APIURL.AUTH}`,
  "Content-Type": "application/json"
}
export const businessSubCategoryApi = createAsyncThunk('business/businessSubCategoryApi', async (e) => {
  let response = await fetch(`${APIURL.BASEURL}business_web_subcategory_list?page=${e.page}&id=${e.id}`, {
    method: "GET",
    headers: headersList
  });
  let data = await response.text();
  return { api: JSON.parse(data), page: e.page }
})

const businessSubCategorySlices = createSlice({
  name: "subcategory",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(businessSubCategoryApi.pending, (state) => {
      state.loading = true
    })
    builder.addCase(businessSubCategoryApi.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.page != 1) {
        if (action.payload.api.totalRow !== state.subcategory.length) {
          state.subcategory.push(...action.payload.api.data)
        }
      } else {
        state.subcategory = action.payload.api.data
      }
      state.error = ''
    })
    builder.addCase(businessSubCategoryApi.rejected, (state, action) => {
      state.loading = false
      state.subcategory = []
      state.error = action.error.message
    })
  }
});


export default businessSubCategorySlices.reducer;
