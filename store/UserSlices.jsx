import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import APIURL from "./Api";

const initialState = {
    loading: false,
    userKey: null,
    login: {},
    register: {},
    otp: {},
    profile: {},
    fb: {},
    pu: {},
    autoList: {},
    propertyList: {},
    propertyCategory: {},
    autoEditShow: {},
    model: null,
    countries: null,
    city: null,
    countrieCode: null,
    error: ''
}

const headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "Authorization": APIURL.AUTH,
    "Content-Type": "application/json"
}

export const userGetKey = createAsyncThunk('userGetKey', async (e) => {
    const value = await AsyncStorage.getItem('@user_key');
    if (value !== null) {
        return value
    }
})

export const userRemoveKey = createAsyncThunk('userRemoveKey', async (e) => {
    try {
        await AsyncStorage.removeItem('@user_key');
        const value = AsyncStorage.getItem('@user_key');
        if (value !== null) {
            return value
        }
    } catch (e) {
        console.log(e)
    }
})

export const userSetKey = createAsyncThunk('userSetKey', async (e) => {
    const jsonValue = JSON.stringify(e);
    await AsyncStorage.setItem('@user_key', jsonValue)
    const value = AsyncStorage.getItem('@user_key');
    if (value !== null) {
        return value
    }
})

export const tokenApi = createAsyncThunk('tokenApi', async (e) => {
    const jsonValue = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}admin_add_token`, {
        method: "POST",
        headers: headersList,
        body: jsonValue
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const loginApi = createAsyncThunk('loginApi', async (e) => {
    const jsonValue = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}web_login?json=${jsonValue}`, {
        method: "POST",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const registerApi = createAsyncThunk('registerApi', async (e) => {
    const jsonValue = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}web_register?json=${jsonValue}`, {
        method: "POST",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const otpApi = createAsyncThunk('otpApi', async (e) => {
    const jsonValue = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}web_otp?json=${e}`, {
        method: "POST",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const forgotPasswordApi = createAsyncThunk('forgotPasswordApi', async (e) => {
    const jsonValue = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}web_forgotpassword?json=${jsonValue}`, {
        method: "POST",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const changePasswordApi = createAsyncThunk('changePasswordApi', async (e) => {
    const jsonValue = JSON.stringify(e);
    let response = await fetch(`${APIURL.BASEURL}web_changepassword?json=${jsonValue}`, {
        method: "POST",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const profileShowApi = createAsyncThunk('profileShowApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_profile_data?key=${e}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const profileUpdateApi = createAsyncThunk('profileUpdateApi', async (e) => {
    if (e.update === 'pUpdate') {
        const jsonValue = JSON.stringify(e.json);
        console.log(jsonValue)
        let response = await fetch(`${APIURL.BASEURL}web_profile_update?key=${e.key}&json=${jsonValue}&type=${e.type}`, {
            method: "POST",
            headers: headersList
        });
        let data = await response.text();
        return JSON.parse(data);
    } else {
        return {}
    }
})

export const autoListApi = createAsyncThunk('autoListApi', async (e) => {
    const jsonValue = JSON.stringify(e)
    let response = await fetch(`${APIURL.BASEURL}web_add_auto`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ dataList: jsonValue })
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const autoImgApi = createAsyncThunk('autoImgApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cars_img_upload_mobile`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(e)
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const propertyImgApi = createAsyncThunk('propertyImgApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_property_img_upload_mobile`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(e)
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const propertyListApi = createAsyncThunk('propertyListApi', async (e) => {
    const jsonValue = JSON.stringify(e)
    let response = await fetch(`${APIURL.BASEURL}web_property_data`, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify({ dataList: jsonValue })
    });
    let data = await response.text();
    return JSON.parse(data);
})

export const propertyCategoryApi = createAsyncThunk('propertyCategoryApi', async (e) => {
    const jsonValue = JSON.stringify(e)
    let response = await fetch(`${APIURL.BASEURL}web_property_dropdown_list?type=${e.json}`, {
        method: "GET",
        headers: headersList,
    });
    let data = await response.text();
    return JSON.parse(data).category;
})

export const countriesApi = createAsyncThunk('countriesApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_countries_droplist`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).data;
})

export const cityApi = createAsyncThunk('cityApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cities_droplist_mobile?id=${e.id}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).data;
})

export const countriesCodeApi = createAsyncThunk('countriesCodeApi', async (e) => {
    let response = await fetch(APIURL.COUNTRY_CODE, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    let output = JSON.parse(data).map((code, i) => {
        return { label: code.name + `(${code.dial_code})`, value: code.dial_code.replace('+', '') }
    })
    return output;
})

export const modelApi = createAsyncThunk('modelApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cars_dropdown_list?type=${e.type}&type_id=${e.type_id}&brand_id=${e.brand_id}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).data;
})

export const dropdownApi = createAsyncThunk('dropdownApi', async (e) => {
    let response = await fetch(`${APIURL.BASEURL}web_cars_dropdown_list?type=${e.type}&type_id=${e.type_id}&brand_id=${e.brand_id}`, {
        method: "GET",
        headers: headersList
    });
    let data = await response.text();
    return JSON.parse(data).data;
})

const userSlices = createSlice({
    name: "User",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(userGetKey.fulfilled, (state, action) => {
            state.loading = false
            state.userKey = action.payload
            state.error = ''
        })
        builder.addCase(userSetKey.fulfilled, (state, action) => {
            state.loading = false
            state.userKey = action.payload
            state.error = ''
        })
        builder.addCase(userRemoveKey.fulfilled, (state, action) => {
            state.loading = false
            state.userKey = action.payload
            state.login = {}
            state.error = ''
        })
        //login
        builder.addCase(loginApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(loginApi.fulfilled, (state, action) => {
            state.loading = false
            state.login = action.payload
            state.error = ''
        })
        builder.addCase(loginApi.rejected, (state, action) => {
            state.loading = false
            state.login = {}
            state.error = action.error.message
        })//register
        builder.addCase(registerApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(registerApi.fulfilled, (state, action) => {
            state.loading = false
            state.register = action.payload
            state.error = ''
        })
        builder.addCase(registerApi.rejected, (state, action) => {
            state.loading = false
            state.register = {}
            state.error = action.error.message
        })
        //Otp
        builder.addCase(otpApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(otpApi.fulfilled, (state, action) => {
            state.loading = false
            state.otp = action.payload
            state.error = ''
        })
        builder.addCase(otpApi.rejected, (state, action) => {
            state.loading = false
            state.otp = {}
            state.error = action.error.message
        })
        //Profile Update
        builder.addCase(profileUpdateApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(profileUpdateApi.fulfilled, (state, action) => {
            state.loading = false
            state.pu = action.payload
            state.error = ''
        })
        builder.addCase(profileUpdateApi.rejected, (state, action) => {
            state.loading = false
            state.pu = {}
            state.error = action.error.message
        })
        //countries
        builder.addCase(countriesApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(countriesApi.fulfilled, (state, action) => {
            state.loading = false
            state.countries = action.payload
            state.error = ''
        })
        builder.addCase(countriesApi.rejected, (state, action) => {
            state.loading = false
            state.countries = []
            state.error = action.error.message
        })
        //city
        builder.addCase(cityApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(cityApi.fulfilled, (state, action) => {
            state.loading = false
            state.city = action.payload
            state.error = ''
        })
        builder.addCase(cityApi.rejected, (state, action) => {
            state.loading = false
            state.city = []
            state.error = action.error.message
        })
        //Model
        builder.addCase(modelApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(modelApi.fulfilled, (state, action) => {
            state.loading = false
            state.model = action.payload
            state.error = ''
        })
        builder.addCase(modelApi.rejected, (state, action) => {
            state.loading = false
            state.model = []
            state.error = action.error.message
        })
        //countrie Code
        builder.addCase(countriesCodeApi.fulfilled, (state, action) => {
            state.loading = false
            state.countrieCode = action.payload
            state.error = ''
        })
        //Otp
        builder.addCase(profileShowApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(profileShowApi.fulfilled, (state, action) => {
            state.loading = false
            state.profile = action.payload
            state.error = ''
        })
        builder.addCase(profileShowApi.rejected, (state, action) => {
            state.loading = false
            state.profile = {}
            state.error = action.error.message
        })
        //Forgot Password
        builder.addCase(forgotPasswordApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(forgotPasswordApi.fulfilled, (state, action) => {
            state.loading = false
            state.fb = action.payload
            state.error = ''
        })
        builder.addCase(forgotPasswordApi.rejected, (state, action) => {
            state.loading = false
            state.fb = {}
            state.error = action.error.message
        })
        //Auto List
        builder.addCase(autoListApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(autoListApi.fulfilled, (state, action) => {
            state.loading = false
            state.autoList = action.payload
            state.error = ''
        })
        builder.addCase(autoListApi.rejected, (state, action) => {
            state.loading = false
            state.autoList = {}
            state.error = action.error.message
        })
        //Property List
        builder.addCase(propertyListApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(propertyListApi.fulfilled, (state, action) => {
            state.loading = false
            state.propertyList = action.payload
            state.error = ''
        })
        builder.addCase(propertyListApi.rejected, (state, action) => {
            state.loading = false
            state.propertyList = {}
            state.error = action.error.message
        })
        //Property Category List
        builder.addCase(propertyCategoryApi.pending, (state) => {
            state.loading = true
        })
        builder.addCase(propertyCategoryApi.fulfilled, (state, action) => {
            state.loading = false
            state.propertyCategory = action.payload
            state.error = ''
        })
        builder.addCase(propertyCategoryApi.rejected, (state, action) => {
            state.loading = false
            state.propertyCategory = {}
            state.error = action.error.message
        })
    }
})

export default userSlices.reducer;