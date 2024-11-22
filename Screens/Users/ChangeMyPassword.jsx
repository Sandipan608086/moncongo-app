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
          <Image style={g.logo} source={require("./../../assets/logo.png")} />
          <Text style={g.Subtitle}>Changer le mot de passe?</Text>
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
                  message: "Mot de passe requis",
                },
                minLength: {
                  value: 6,
                  message:
                    "Le mot de passe doit contenir au moins 6 caractères",
                },
                maxLength: {
                  value: 30,
                  message:
                    "Le mot de passe doit contenir entre 6 et 30 caractères",
                },
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  secureTextEntry={true}
                  mode="outlined"
                  placeholder="Mot de passe"
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
                  message: "Vous devez spécifier un mot de passe",
                },
                validate: (value) => value === watch('passwordname') || "Les mots de passe ne correspondent pas",
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  secureTextEntry={true}
                  mode="outlined"
                  placeholder="Retaper le mot de passe"
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
                    navigation.navigate("Profil");
                    Alert.alert(req.payload.message);
                    setLoading(false);
                  } else {
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

export default ChangeMyPasswordScreen;
