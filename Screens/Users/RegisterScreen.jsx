import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Platform
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm, Controller } from "react-hook-form";
import RNPickerSelect from "react-native-picker-select";
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
  Switch,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
  countriesApi,
  cityApi,
  countriesCodeApi,
  registerApi,
} from "./../../store/UserSlices";
import AppbarHeader from "../../component/Appbar";

const RegisterScreen = ({ navigation }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isloading, setLoading] = useState(false);
  // const COUNTRIES = useSelector(state => state.user.countries);
  // const CITY = useSelector(state => state.user.city);
  const [COUNTRIES, setCOUNTRIES] = useState([]);
  const [city, setCity] = useState([]);
  const COUNTRIESCODE = useSelector((state) => state.user.countrieCode);
  // const REGISTER = useSelector(state => state.user.register);
  const [checked, setChecked] = useState(false);
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
      conpassword: "",
      country: 50,
      city: 26,
      phone: "",
      phoneCode: "243",
      whatsappCode: "243",
      whatsapp: "",
      company: "",
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
      // routeData && cityClick(routeData.crm_country);
    });
  };
  useEffect(() => {
    (async function () {
      try {
        countryClick();
        dispatch(countriesCodeApi());
      } catch (e) {
        console.log(e);
      }
    })();
    // let defaults = {
    //     name: '',
    //     email: '',
    //     conpassword: '',
    //     country: '',
    //     city: '',
    //     phone: '',
    //     phoneCode: '243',
    //     whatsappCode: '243',
    //     whatsapp: '',
    //     company: ''
    // }
    // if(isFocused === true){
    //     reset(defaults)
    //     countryClick()
    // }
  }, [reset, isFocused]);

  return (
    <SafeAreaView style={g.Container}>
      <AppbarHeader title="" back={true} home={true} navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={g.Content} contentContainerStyle={{ flexGrow: 1 }}>
          <Image alt="image"
            style={[g.logo, { marginTop: 20 }]}
            source={require("./../../assets/logo.png")}
          />
          <Text style={g.Subtitle}>Inscrivez-vous</Text>
          <View style={g.Form}>
            <Controller
              control={control}
              name="name"
              rules={{
                required: {
                  value: true,
                  message: "Nom is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Nom *"
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
              name="email"
              rules={{
                required: {
                  value: true,
                  message: "L'e-mail est requis",
                },
                pattern: {
                  value:
                    /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                  message: "Le courriel est invalide",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Email *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.email && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.email.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="conpassword"
              rules={{
                required: {
                  value: true,
                  message: "Mot de passe requis",
                },
                minLength: {
                  value: 8,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères",
                },
                maxLength: {
                  value: 30,
                  message:
                    "Le mot de passe doit contenir entre 8 et 30 caractères",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  secureTextEntry={true}
                  mode="outlined"
                  placeholder="Mot de passe *"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.conpassword && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.conpassword.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="country"
              rules={{
                required: {
                  value: true,
                  message: "Pays is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <RNPickerSelect
                  placeholder={{
                    label: "Pays *",
                    value: null,
                    color: "#9EA0A4",
                  }}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(e) => {
                    if (e != null) {
                      onChange(e);
                      cityClick(e);
                    }
                  }}
                  value={value}
                  items={COUNTRIES}
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
                  message: "Ville is required",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <RNPickerSelect
                  placeholder={{
                    label: "Ville *",
                    value: null,
                    color: "#9EA0A4",
                  }}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={onChange}
                  value={value}
                  items={city != null ? city : []}
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
                rules={{
                  required: {
                    value: true,
                    message: "Telephone Numéro is required",
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 1.5, marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      placeholder="Numéro de téléphone *"
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
            <View style={{ flexDirection: "row" }}>
              {errors.phoneCode && (
                <Text style={{ color: "red" }} role="alert">
                  {" "}
                  {errors.phoneCode.message}{" "}
                </Text>
              )}
              {errors.phone && (
                <Text style={{ color: "red" }} role="alert">
                  {" "}
                  {errors.phone.message}{" "}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row" }}>
              <Controller
                control={control}
                name="whatsappCode"
                rules={{
                  required: {
                    value: true,
                    message: "Numéro de code required",
                  },
                }}
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
                rules={{
                  required: {
                    value: true,
                    message: "Numéro Whatsapp is required",
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <View style={{ flex: 1.5, marginTop: 10 }}>
                    <TextInput
                      mode="outlined"
                      placeholder="Numéro Whatsapp *"
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
            <View style={{ flexDirection: "row" }}>
              {errors.whatsappCode && (
                <Text style={{ color: "red" }} role="alert">
                  {" "}
                  {errors.whatsappCode.message}{" "}
                </Text>
              )}
              {errors.whatsapp && (
                <Text style={{ color: "red" }} role="alert">
                  {" "}
                  {errors.whatsapp.message}{" "}
                </Text>
              )}
            </View>

            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Nom de l’entreprise (optionnel)"
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
              name="address"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Adresse (optionnel)"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              {/* <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked);
                                }}
                            /> */}
              <Switch
                color="#0298d3"
                value={checked}
                onValueChange={() => {
                  setChecked(!checked);
                }}
                style={{marginRight: 5}}
              />
              <Text
                style={{ marginTop: 4, fontSize: Platform.OS === "ios" ? 13 : 12 }}
                onPress={() =>
                  navigation.navigate(
                    "SettingPage",
                    JSON.stringify("terms-and-conditions")
                  )
                }
              >
                J’accepte les termes et conditions.
              </Text>
            </View>
            <Button
              style={[g.Btn, { marginBottom: 100 }]}
              mode="contained"
              disabled={isloading}
              loading={isloading}
              onPress={handleSubmit((values) => {
                if(checked === true) {
                  setLoading(true);
                  dispatch(registerApi({ data: values })).then((req) => {
                    if (req.payload.status === true) {
                      navigation.navigate(
                        "Otp",
                        JSON.stringify({ email: req.payload.email })
                      );
                      setLoading(false);
                    } else if (req.payload.status === false) {
                      Alert.alert(req.payload.message);
                      setLoading(false);
                    }
                  });
                } else {
                  Alert.alert('Veuillez vérifier les termes et conditions');
                }
              })}
            >
              Envoyer
            </Button>
          </View>
        </View>
      </ScrollView>
      <View style={g.bottom}>
        <View>
          <List.Item
            title="J’ai déjà un compte?"
            titleStyle={[g.list, { fontSize: 12 }]}
            right={() => (
              <Button
                labelStyle={g.lBtn}
                onPress={() => navigation.navigate("Login")}
              >
                Se connecter
              </Button>
            )}
          />
        </View>
      </View>
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
});
export default RegisterScreen;
