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
import {
  Appbar,
  Surface,
  Text,
  TextInput,
  List,
  HelperText,
  Provider,
  Button,
} from "react-native-paper";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm, Controller } from "react-hook-form";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { changePasswordApi } from "./../../store/UserSlices";

const ChangeMyPasswordScreen = ({ navigation, route }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const [isloading, setLoading] = useState(false);
  const routeData = JSON.parse(route.params);
  const {
    control,
    setFocus,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: routeData.email,
      password: "",
    },
    mode: "onChange",
  });
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
          <Image alt="image" style={g.logo} source={require("./../../assets/logo.png")} />
          <Text style={g.Subtitle}>Want to change password?</Text>
          <View style={g.Form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  mode="outlined"
                  placeholder="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                  disabled
                />
              )}
            />
            <Controller
              control={control}
              name="passwordname"
              rules={{
                required: {
                  value: true,
                  message: "This field is required",
                },
                minLength: {
                  value: 6,
                  message:
                    "Password must contain at least 6 characters",
                },
                maxLength: {
                  value: 30,
                  message:
                    "Password must contain between 6 and 30 characters",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  secureTextEntry={true}
                  mode="outlined"
                  placeholder="Password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.passwordname && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.passwordname.message}{" "}
              </Text>
            )}
            <Controller
              control={control}
              name="password"
              rules={{
                required: {
                  value: true,
                  message: "You must specify a password",
                },
                validate: (value) => value === watch('passwordname') || "The passwords do not match.",
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  secureTextEntry={true}
                  mode="outlined"
                  placeholder="Retype password"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ marginTop: 10, backgroundColor: "#ffffff" }}
                  activeOutlineColor={"#0298d3"}
                />
              )}
            />
            {errors.password && (
              <Text style={{ color: "red" }} role="alert">
                {" "}
                {errors.password.message}{" "}
              </Text>
            )}
            <Button
              style={[g.Btn, { marginBottom: 100 }]}
              mode="contained"
              disabled={isloading}
              loading={isloading}
              onPress={handleSubmit((data) => {
                setLoading(true);
                dispatch(changePasswordApi(data)).then((req) => {
                  if (req.payload.status === true) {
                    navigation.navigate("Profile");
                    Alert.alert(req.payload.message);
                    setLoading(false);
                  } else {
                    Alert.alert(req.payload.message);
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

export default ChangeMyPasswordScreen;
