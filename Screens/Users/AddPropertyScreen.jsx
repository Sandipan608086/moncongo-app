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
import { Dropdown } from "react-native-element-dropdown";
import { useIsFocused } from "@react-navigation/native";
import {
  Checkbox,
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
  propertyListApi,
  cityApi,
  countriesApi,
} from "./../../store/UserSlices";
const AddPropertyScreen = ({ navigation, route }) => {
  const g = require("./../../Navigation/Style");
  const routeData = JSON.parse(route.params);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isloading, setLoading] = useState(false);
  const [paytype, setPaytype] = useState('Prix ($) *');
  // const COUNTRIES = useSelector(state => state.user.countries);
  // const CITY = useSelector(state => state.user.city);
  const [COUNTRIES, setCOUNTRIES] = useState([]);
  const [city, setCity] = useState([]);
  const COUNTRIESCODE = useSelector((state) => state.user.countrieCode);

  const PROPERTYCATEGORY = useSelector((state) => state.user.propertyCategory);
  const userKey = useSelector((state) => state.user.userKey);

  const countryClick = () => {
    dispatch(countriesApi()).then((res) => {
      setCOUNTRIES(res.payload);
      routeData.data && cityClick(routeData.data.property_country);
    });
  };

  const cityClick = (value) => {
    dispatch(cityApi({ id: value })).then((res) => {
      setCity(res.payload);
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
      category: "",
      type: "",
      listed: "",
      price: "",
      priceNegotiable: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      furnished: "",
      lift: "",
      parking: "",
      generator: "",
      security: "",
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
    // (async function () {
    //   try {
    //     countryClick();
    //   } catch (e) {
    //     console.log(e);
    //   }
    // })();
    let defaults = {
      name:
        routeData.type == "editProperty" ? routeData.data.property_title : "",
      slug:
        routeData.type == "editProperty" ? routeData.data.property_slug : "",
      category:
        routeData.type == "editProperty"
          ? routeData.data.property_category
          : "",
      type:
        routeData.type == "editProperty" ? routeData.data.property_type : "",
      listed:
        routeData.type == "editProperty" ? routeData.data.property_listed : "",
      price:
        routeData.type == "editProperty" ? routeData.data.property_price : "",
      priceNegotiable:
        routeData.type == "editProperty"
          ? routeData.data.property_negotiable
          : "",
      bedrooms:
        routeData.type == "editProperty"
          ? routeData.data.property_bedrooms
          : "",
      bathrooms:
        routeData.type == "editProperty"
          ? routeData.data.property_bathrooms
          : "",
      area:
        routeData.type == "editProperty"
          ? routeData.data.property_unit_of_area
          : "",
      furnished:
        routeData.type == "editProperty"
          ? routeData.data.property_furnished
          : "",
      lift:
        routeData.type == "editProperty" ? routeData.data.property_lift : "",
      parking:
        routeData.type == "editProperty" ? routeData.data.property_parking : "",
      generator:
        routeData.type == "editProperty"
          ? routeData.data.property_generator
          : "",
      security:
        routeData.type == "editProperty"
          ? routeData.data.property_security
          : "",
      address:
        routeData.type == "editProperty" ? routeData.data.property_address : "",
      country:
        routeData.type == "editProperty" ? routeData.data.property_country : 216,
      city:
        routeData.type == "editProperty" ? routeData.data.property_citys : 3,
      phoneCode:
        routeData.type == "editProperty" ? routeData.data.code_mobile : 255,
      phone:
        routeData.type == "editProperty" ? routeData.data.property_mobile : "",
      whatsappCode:
        routeData.type == "editProperty"
          ? routeData.data.code_whatsapp
          : 255,
      whatsapp:
        routeData.type == "editProperty"
          ? routeData.data.property_whatsapp
          : "",
      description:
        routeData.type == "editProperty"
          ? routeData.data.property_long_text
          : "",
    }
    if (isFocused === true) {
      reset(defaults);
      countryClick();
      routeData.data != undefined ? cityClick(routeData.data.property_country) : cityClick(216)
    }
  }, [reset, isFocused]);
  return (
    <SafeAreaView style={g.Container}>
      <AppbarHeader
        title={
          routeData.type === "addProperty"
            ? "Add Property"
            : "Edit Property"
        }
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
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
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
              name="category"
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
                  data={PROPERTYCATEGORY}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Category *"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                  }}
                />
              )}
            />
            {errors.category && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.category.message}{" "}
              </Text>
            )}

            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Sell", value: "sell" },
                    { label: "Rent", value: "rent" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Type"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                    setPaytype(e.value === 'rent' ? 'Prix ($/mois) *' : 'Prix ($) *')
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="listed"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Owner", value: "owner" },
                    { label: "Agent", value: "agent" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Listed by"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
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
                  placeholder={paytype}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
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
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Negotiable"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="bedrooms"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Bedrooms *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
                />
              )}
            />

            <Controller
              control={control}
              name="bathrooms"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Bathrooms *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
                />
              )}
            />

            <Controller
              control={control}
              name="area"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Dimensions (㎡)"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
                />
              )}
            />

            <Controller
              control={control}
              name="furnished"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Furnished"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="lift"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Lift"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="parking"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Parking"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="generator"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Generator"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="security"
              render={({ field: { onChange, value, onBlur } }) => (
                <Dropdown
                  style={pickerSelectStyles.dropdown}
                  placeholderStyle={pickerSelectStyles.placeholderStyle}
                  selectedTextStyle={pickerSelectStyles.selectedTextStyle}
                  inputSearchStyle={pickerSelectStyles.inputSearchStyle}
                  iconStyle={pickerSelectStyles.iconStyle}
                  data={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Security"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
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
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
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
                  placeholder="City"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value)
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
                name="phone"
                rules={{
                  required: {
                    value: true,
                    message: "This field is required",
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 1.5, marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      placeholder="Phone Number *"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      style={{ backgroundColor: '#ffffff' }}
                      activeOutlineColor={'#0298d3'}
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
                      placeholder="WhatsApp Number"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      style={{ marginTOp: 10, backgroundColor: '#ffffff' }}
                      activeOutlineColor={'#0298d3'}
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
                  style={{ marginTop: 10, backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
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
                dispatch(
                  propertyListApi(
                    routeData.type === "editProperty"
                      ? {
                        type: "propertyEdit",
                        mobile: "",
                        key: JSON.parse(userKey),
                        id: routeData.data.property_id,
                        flier: [],
                        list: "",
                        value: values,
                      }
                      : {
                        type: "propertyAdd",
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
                    navigation.navigate("ListProperty");
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
export default AddPropertyScreen;
