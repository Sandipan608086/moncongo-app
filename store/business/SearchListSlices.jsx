import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "../Api";
const initialState = {
  loading: false,
  searchlist: [],
  cityfilters: [],
  error: ''
}
const headersList = {
  "Accept": "*/*",
  "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  "Authorization": `${APIURL.AUTH}`,
  "Content-Type": "application/json"
}
export const searchListApi = createAsyncThunk('business/searchListApi', async (e) => {
  let response = await fetch(`${APIURL.BASEURL}business_web_search_list?page=${e.page}&search=${e.search}&cityId=${e.cityId}`, {
    method: "GET",
    headers: headersList
  });
  let data = e.search != '' ? await response.text() : { data: [] };
  return { api: JSON.parse(data), page: e.page }
})
export const searchListEmpty = () => {

}
const searchListSlices = createSlice({
  name: "searchListApi",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(searchListApi.pending, (state) => {
      state.loading = true
    })
    builder.addCase(searchListApi.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload.page > 1) {
        if (action.payload.api.totalRow !== state.searchlist.length) {
          if(action.payload.api.data == null) {
            state.searchlist = []
          } else {
            state.searchlist.push(...action.payload.api.data)
          }
        }
      } else {
        state.searchlist = action.payload.api.data;
      }
      state.cityfilters = action.payload.api.cityfilters;
      state.error = ''
    })
    builder.addCase(searchListApi.rejected, (state, action) => {
      state.loading = false
      state.searchlist = []
      state.error = action.error.message
    })
  }
});


export default searchListSlices.reducer;
