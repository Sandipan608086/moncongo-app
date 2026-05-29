import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,

  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from "react-native-picker-select";
import { useIsFocused } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Appbar,
  Surface,
  Text,
  Button,
  TextInput,
  List,
  HelperText,
  Provider,
} from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import {
  autoListApi,
  countriesApi,
  cityApi,
  modelApi,
  dropdownApi,
} from "./../../store/UserSlices";

const AddAutoScreen = ({ navigation, route }) => {
  const g = require("./../../Navigation/Style");
  const routeData = JSON.parse(route.params);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isloading, setLoading] = useState(false);
  const [convertToSlug, setConvertToSlug] = useState("");
  // const COUNTRIES = useSelector(state => state.user.countries);
  // const CITY = useSelector(state => state.user.city);
  const [COUNTRIES, setCOUNTRIES] = useState([]);
  const [city, setCity] = useState([]);
  const COUNTRIESCODE = useSelector((state) => state.user.countrieCode);

  const [MODELLIST, setMODELLIST] = useState([]);
  const [TYPELIST, setTYPELIST] = useState([]);
  const [BRANDLIST, setBRANDLIST] = useState([]);

  const [TYPEID, setTYPEID] = useState(0);
  const userKey = useSelector((state) => state.user.userKey);

  const countryClick = () => {
    dispatch(countriesApi()).then((res) => {
      setCOUNTRIES(res.payload);
      routeData.data && cityClick(routeData.data.car_country);
    });
  };
  const cityClick = (value) => {
    dispatch(cityApi({ id: value })).then((res) => {
      setCity(res.payload);
    });
  };

  const typeClick = () => {
    dispatch(dropdownApi({ type: "cars_type" })).then((res) => {
      setTYPELIST(res.payload);
    });
  };
  const brandClick = (id) => {
    dispatch(dropdownApi({ type: "car_brand", type_id: id })).then((res) => {
      setBRANDLIST(res.payload != null ? res.payload : []);
      routeData.data && modelsClick(JSON.parse(routeData.data.brand_id));
      setMODELLIST([])
    });
  };
  const modelsClick = (id) => {
    dispatch(
      dropdownApi({
        type: "car_models",
        type_id: TYPEID > 0 ? TYPEID : routeData.data.type_id,
        brand_id: id,
      })
    ).then((res) => {
      // console.log(res.payload)
      setMODELLIST(res.payload != null ? res.payload : []);
    });
  };

  const {
    control,
    setFocus,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      type: "",
      brand: "",
      models: "",
      price: "",
      priceNegotiable: "",
      year: "",
      kilometers: "",
      color: "",
      doors: "",
      transmission: "",
      wheeldrive: "",
      airconditioner: "",
      steering: "",
      fuel: "",
      address: "",
      country: "",
      city: "",
      phoneCode: "",
      phone: "",
      whatsappCode: "",
      whatsapp: "",
      description: "",
    },
    mode: "onChange",
  });
  useEffect(() => {
    let defaults = {
      name: routeData.type == "editAuto" ? routeData.data.car_name : "",
      slug:
        routeData.type == "editAuto" ? routeData.data.car_slug : convertToSlug,
      type:
        routeData.type == "editAuto" ? JSON.parse(routeData.data.type_id) : "",
      brand:
        routeData.type == "editAuto" ? JSON.parse(routeData.data.brand_id) : "",
      models:
        routeData.type == "editAuto"
          ? JSON.parse(routeData.data.car_model)
          : "",
      price: routeData.type == "editAuto" ? routeData.data.car_price : "",
      priceNegotiable:
        routeData.type == "editAuto" ? routeData.data.car_negotiable : "",
      year: routeData.type == "editAuto" ? routeData.data.car_year : "",
      kilometers:
        routeData.type == "editAuto" ? routeData.data.car_kilometers : "",
      color: routeData.type == "editAuto" ? routeData.data.car_color : "",
      doors: routeData.type == "editAuto" ? routeData.data.car_doors : "",
      transmission:
        routeData.type == "editAuto"
          ? routeData.data.car_transmission_type
          : "",
      wheeldrive:
        routeData.type == "editAuto" ? routeData.data.car_wheel_drive : "",
      airconditioner:
        routeData.type == "editAuto" ? routeData.data.car_air_conditioner : "",
      steering: routeData.type == "editAuto" ? routeData.data.car_steering : "",
      fuel: routeData.type == "editAuto" ? routeData.data.car_fuel : "",
      address: routeData.type == "editAuto" ? routeData.data.car_address : "",
      country: routeData.type == "editAuto" ? routeData.data.car_country : 216,
      city: routeData.type == "editAuto" ? routeData.data.car_citys : 3,
      phoneCode:
        routeData.type == "editAuto" ? routeData.data.code_mobile : 255,
      phone: routeData.type == "editAuto" ? routeData.data.car_mobile : "",
      whatsappCode:
        routeData.type == "editAuto" ? routeData.data.code_whatsapp : 255,
      whatsapp: routeData.type == "editAuto" ? routeData.data.car_whatsapp : "",
      description:
        routeData.type == "editAuto" ? routeData.data.car_long_text : "",
    };

    if (isFocused === true) {
      reset(defaults);
      countryClick();
      routeData.data != undefined
        ? cityClick(routeData.data.car_country)
        : cityClick(3);
      typeClick();
      routeData.data && brandClick(JSON.parse(routeData.data.type_id));
    }
  }, [convertToSlug, reset, isFocused]);
  return (
    <SafeAreaView style={g.Container}>
      <AppbarHeader
        title={routeData.type === "addAuto" ? "Add Vehicle" : "Edit Vehicle"}
        back={true}
        home={false}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={g.Content} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={g.Form}>
            <Controller
              control={control}
              name="name"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Name *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.name && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.name.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="type"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={TYPELIST}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Type *"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                    brandClick(e.value);
                    setTYPEID(e.value);
                  }}
                />
              )}
            />
            {errors.type && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.type.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="brand"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={BRANDLIST}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Brand"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                    modelsClick(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="models"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={MODELLIST}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Model"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="price"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Price TSH *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.price && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.price.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="priceNegotiable"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Negotiable Price"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="year"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Year"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            <Controller
              control={control}
              name="kilometers"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Milage"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            <Controller
              control={control}
              name="color"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Color"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            <Controller
              control={control}
              name="doors"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "2 Doors", value: "2" },
                    { label: "4 Doors", value: "4" },
                    { label: "6 Doors", value: "6" },
                    { label: "8 Doors", value: "8" },
                    { label: "10 Doors", value: "10" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Number of Doors"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="transmission"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Automatic", value: "automatic" },
                    { label: "Manual", value: "manual" },
                    { label: "Dual Clutch", value: "dual_clutch" },
                    {
                      label: "Variation continue",
                      value: "continuously_variable",
                    },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Transmission"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="wheeldrive"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "All", value: "all" },
                    { label: "Four", value: "four" },
                    { label: "Front", value: "front" },
                    { label: "Rear", value: "rear" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Wheel Drive"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="airconditioner"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Air Conditioning"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="steering"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Left", value: "left" },
                    { label: "Right", value: "right" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Steering"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="fuel"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Diesel", value: "diesel" },
                    { label: "CNG", value: "cng" },
                    { label: "Battery", value: "battery" },
                    { label: "Gasoline", value: "gasoline" },
                    { label: "Petrol", value: "petrol" },
                    { label: "Others", value: "others" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Fuel"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="address"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Address *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.address && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.address.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="country"
              rules={{
                required: {
                  value: true,
                  message: "Country is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={COUNTRIES != null ? COUNTRIES : []}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Country"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    // if (e != null) {
                    onChange(e.value);
                    cityClick(e.value);
                    // }
                  }}
                />
              )}
            />
            {errors.country && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.country.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="city"
              rules={{
                required: {
                  value: true,
                  message: "City is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={city != null ? city : []}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="City *"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            {errors.city && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.city.message}{" "}
              </Text>
            )}

            <View style={{ flexDirection: "row" }}>
              <Controller
                control={control}
                name="phoneCode"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 0.5, marginRight: 10 }}>
                    <RNPickerSelect
                      placeholder={{
                        label: "Phone Code",
                        value: null,
                        color: "#9EA0A4",
                      }}
                      style={pickerSelectStyles}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={onChange}
                      value={value}
                      items={COUNTRIESCODE != null ? COUNTRIESCODE : []}
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Ce champ est obligatoire",
                  },
                }}
                name="phone"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 1.5, marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      placeholder="Contact number *"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      style={{ backgroundColor: "#ffffff" }}
                      activeOutlineColor={"#0298d3"}
                    />
                  </View>
                )}
              />
            </View>
            {errors.phone && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.phone.message}{" "}
              </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Controller
                control={control}
                name="whatsappCode"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 0.5, marginRight: 10 }}>
                    <RNPickerSelect
                      placeholder={{
                        label: "WhatsApp Code",
                        value: null,
                        color: "#9EA0A4",
                      }}
                      style={pickerSelectStyles}
                      useNativeAndroidPickerStyle={false}
                      onValueChange={onChange}
                      value={value}
                      items={COUNTRIESCODE != null ? COUNTRIESCODE : []}
                    />
                  </View>
                )}
              />
              <Controller
                control={control}
                name="whatsapp"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 1.5, marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      placeholder="WhatsApp Number *"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      style={{ backgroundColor: "#ffffff" }}
                      activeOutlineColor={"#0298d3"}
                    />
                  </View>
                )}
              />
            </View>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Description"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            <Button
              style={[g.Btn, { marginBottom: 100 }]}
              mode="contained"
              disabled={isloading}
              loading={isloading}
              onPress={handleSubmit((values) => {
                setLoading(true);
                // console.log(values)
                // console.log(routeData.data.car_id)
                dispatch(
                  autoListApi(
                    routeData.type === "editAuto"
                      ? {
                        type: "autoEdit",
                        key: JSON.parse(userKey),
                        id: routeData.data.car_id,
                        flier: [],
                        list: "",
                        value: values,
                      }
                      : {
                        type: "autoAdd",
                        mobile: "mobile",
                        key: JSON.parse(userKey),
                        flier: [],
                        list: "",
                        value: values,
                      }
                  )
                ).then((res) => {
                  if (res.payload.status === true) {
                    Alert.alert(res.payload.message);
                    navigation.navigate("ListAuto");
                    setLoading(false);
                  } else {
                    Alert.alert(res.payload.message);
                    setLoading(false);
                  }
                });
              })}
            >
              Submit
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    backgroundColor: "white",
  },
  placeholder: {
    color: "gray",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderWidth: 1,
    borderRadius: 4,
    color: "black",
    borderColor: "gray",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginTop: 10,
    backgroundColor: "white",
  },
  dropdown: {
    marginTop: 8,
    height: 53,
    borderColor: "gray",
    borderWidth: 0.9,
    fontFamily: "Poppins_400Regular",
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingStart: 15,
    fontFamily: "Poppins_400Regular",
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingStart: 15,
    fontFamily: "Poppins_400Regular",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
});
export default AddAutoScreen;
