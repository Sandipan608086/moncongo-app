import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
} from "react-native";
import {
  Appbar,
  Surface,
  Text,
  Button,
  TextInput,
  List,
  HelperText,
} from "react-native-paper";
import { FormBuilder } from "react-native-paper-form-builder";
import { useForm, Controller } from "react-hook-form";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { loginApi, userSetKey } from "../../store/UserSlices";

const LoginScreen = ({ navigation }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const [isloading, setLoading] = useState(false);
  const {
    control,
    setFocus,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  return (
    <SafeAreaView style={g.Container}>
      <AppbarHeader title="" back={true} home={false} navigation={navigation} />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={g.Content} contentContainerStyle={{ flexGrow: 1 }}>
          <Image alt="image" style={g.logo} source={require("./../../assets/logo.png")} />
          <Text style={g.Subtitle}>SE CONNECTER</Text>
          <View style={g.Form}>
            {/* <FormBuilder
                            control={control}
                            setFocus={setFocus}
                            formConfigArray={[
                                {
                                    type: 'email',
                                    name: 'email',
                                    rules: {
                                        required: {
                                            value: true,
                                            message: 'Ce champ est obligatoire',
                                        },
                                        pattern: {
                                            value: /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                                            message: 'Ce champ doit être un email valide',
                                        },
                                    },
                                    textInputProps: {
                                        label: 'Email',
                                    },
                                },
                                {
                                    type: 'password',
                                    name: 'password',
                                    rules: {
                                        required: {
                                            value: true,
                                            message: ' Ce champ est obligatoire',
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'Le mot de passe doit contenir au moins 6 caractères',
                                        },
                                        maxLength: {
                                            value: 30,
                                            message: 'Le mot de passe doit contenir entre 6 et 30 caractères',
                                        },
                                    },
                                    textInputProps: {
                                        label: 'Mot de passe',
                                    },
                                },
                            ]}
                        /> */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: {
                  value: true,
                  message: "Ce champ est obligatoire",
                },
                pattern: {
                  value:
                    /[A-Za-z0-9._%+-]{1,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                  message: "Ce champ doit être un email valide",
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
              name="password"
              rules={{
                required: {
                  value: true,
                  message: " Ce champ est obligatoire",
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
                  placeholder="Mot de passe *"
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
              labelStyle={g.fBtn}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Mot de passe oublié ?
            </Button>
            <Button
              style={[g.Btn, { marginBottom: 100 }]}
              mode="contained"
              disabled={isloading}
              loading={isloading}
              onPress={handleSubmit((values) => {
                setLoading(true);
                dispatch(loginApi({ data: values })).then((req) => {
                  if (req.payload.status === true) {
                    dispatch(userSetKey(req.payload.authorization));
                    navigation.navigate("Profil");
                    setLoading(false);
                  } else if (req.payload.appEmail === true) {
                    navigation.navigate(
                      "Otp",
                      JSON.stringify({ email: req.payload.email })
                    );
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
      <View style={g.bottom}>
        <View>
          <List.Item
            title="Vous n'avez pas de compte?"
            titleStyle={[g.list, { fontSize: 12 }]}
            right={() => (
              <Button
                labelStyle={g.lBtn}
                onPress={() => navigation.navigate("Register")}
              >
                Inscrivez-vous
              </Button>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
