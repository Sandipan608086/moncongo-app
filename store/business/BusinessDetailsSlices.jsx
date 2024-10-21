import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "../Api";
const initialState = {
  loading: false,
  businesshome: {},
  error: ''
}
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Authorization": `${APIURL.AUTH}`,
  "Content-Type": "application/json"
}
export const businessDetailsApi = createAsyncThunk('business/businessDetailsApi', async (e) => {
  let response = await fetch(`${APIURL.BASEURL}business_web_details?slug=${e.slug}`, {
    method: "GET",
    headers: headersList
  });
  let data = await response.text();
  return JSON.parse(data)
})

const businessDetailsSlices = createSlice({
  name: "businessdetails",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(businessDetailsApi.pending, (state) => {
      state.loading = true
    })
    builder.addCase(businessDetailsApi.fulfilled, (state, action) => {
      state.loading = false
      state.businesshome = action.payload.data
      state.error = ''
    })
    builder.addCase(businessDetailsApi.rejected, (state, action) => {
      state.loading = false
      state.businesshome = {}
      state.error = action.error.message
    })
  }
});


export default businessDetailsSlices.reducer;
