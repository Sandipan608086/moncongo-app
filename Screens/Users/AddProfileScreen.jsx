import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Content,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from "react-native-picker-select";
import { Dropdown } from "react-native-element-dropdown";
import { useIsFocused } from "@react-navigation/native";
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
  countriesApi,
  cityApi,
  countriesCodeApi,
  profileUpdateApi,
  userGetKey,
  profileShowApi,
} from "./../../store/UserSlices";
const AddProfileScreen = ({ navigation, route }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isloading, setLoading] = useState(false);
  // const CITY = useSelector(state => state.user.city);
  // const COUNTRIES = useSelector(state => state.user.countries);
  const [COUNTRIES, setCOUNTRIES] = useState([]);
  const [city, setCity] = useState([]);
  const COUNTRIESCODE = useSelector((state) => state.user.countrieCode);
  // const PROFILEUPDATE = useSelector(state => state.user.pu);
  const routeData = JSON.parse(route.params);
  const userKey = useSelector((state) => state.user.userKey);
  const {
    control,
    setFocus,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      country: "",
      city: "",
      phoneCode: "",
      phone: "",
      whatsappCode: "",
      whatsapp: "",
      company: "",
      address: "",
    },
    mode: "onChange",
  });
  const cityClick = (value) => {
    dispatch(cityApi({ id: value })).then((res) => {
      setCity(res.payload);
    });
  };
  const countryClick = () => {
    dispatch(countriesApi()).then((res) => {
      setCOUNTRIES(res.payload);
      // routeData && cityClick(routeData.customer_country);
    });
  };
  useEffect(() => {
    (async function () {
      try {
        await dispatch(userGetKey()).then(() => {
          // countryClick();
          dispatch(countriesCodeApi());
        });
      } catch (e) {
        console.log(e);
      }
    })();
    let defaults = {
      name: routeData ? routeData.customer_name : "",
      email: routeData ? routeData.customer_email : "",
      country: routeData ? routeData.customer_country : "",
      city: routeData ? routeData.customer_city : "",
      phoneCode: routeData ? routeData.customer_phoneCode : "",
      phone: routeData ? routeData.customer_phone : "",
      whatsappCode: routeData ? routeData.customer_whatsappCode : "",
      whatsapp: routeData ? routeData.customer_whatsapp : "",
      company: routeData ? routeData.customer_company : "",
      address: routeData ? routeData.customer_address : "",
    };
    if (isFocused === true) {
      reset(defaults);
      countryClick();
      cityClick(routeData.customer_country);
    }
  }, [reset, isFocused]);
  return (
    <SafeAreaView style={g.Container}>
      <AppbarHeader
        title="Editer le profil"
        back={true}
        home={true}
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
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Email Id"
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
              name="country"
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
                  placeholder="Pays"
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
            <Controller
              control={control}
              name="city"
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
                  placeholder="Ville"
                  searchPlaceholder="Search..."
                  value={value}
                  onChange={(e) => {
                    onChange(e.value);
                  }}
                />
              )}
            />
            <View style={{ flexDirection: "row" }}>
              <Controller
                control={control}
                name="phoneCode"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 0.5, marginRight: 10 }}>
                    <RNPickerSelect
                      placeholder={{
                        label: "Numéro de code",
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
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 1.5, marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      placeholder="Telephone Numéro"
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
            <View style={{ flexDirection: "row" }}>
              <Controller
                control={control}
                name="whatsappCode"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 0.5, marginRight: 10 }}>
                    <RNPickerSelect
                      placeholder={{
                        label: "Numéro de code",
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
                      placeholder="Numéro Whatsapp"
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
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Nom de l’entreprise"
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
              name="address"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Adresse"
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
                  profileUpdateApi({
                    key: JSON.parse(userKey),
                    json: { data: values },
                    type: "profile_update",
                    update: "pUpdate",
                  })
                ).then((req) => {
                  if (req.payload.statusMobile === true) {
                    dispatch(profileUpdateApi({ update: "eUpdate" }));
                    dispatch(profileShowApi(JSON.parse(userKey)));
                    navigation.navigate("Profil");
                    Alert.alert(req.payload.message);
                    setLoading(false);
                  } else if (req.payload.statusMobile === false) {
                    Alert.alert(req.payload.message);
                    setLoading(false);
                  }
                });
              })}
            >
              Envoyer
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
    color: "#000000",
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
export default AddProfileScreen;
