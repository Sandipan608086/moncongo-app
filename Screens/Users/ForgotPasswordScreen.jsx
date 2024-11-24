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
import { forgotPasswordApi } from "../../store/UserSlices";

const ForgotPasswordScreen = ({ navigation }) => {
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
          <Text style={g.Subtitle}>Mot de passe oublié?</Text>
          <View style={g.Form}>
            {/* <FormBuilder
              control={control}
              setFocus={setFocus}
              formConfigArray={[
                {
                  type: "email",
                  name: "email",
                  rules: {
                    required: {
                      value: true,
                      message: "L'e-mail est requis",
                    },
                    pattern: {
                      value:
                        /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                      message: "Le courriel est invalide",
                    },
                  },
                  textInputProps: {
                    label: "Email",
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
                  placeholder="Email"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{ backgroundColor: '#ffffff' }}
                  activeOutlineColor={'#0298d3'}
                />
              )}
            />
            <Button
              style={[g.Btn, { marginBottom: 100 }]}
              mode="contained"
              disabled={isloading}
              loading={isloading}
              onPress={handleSubmit((data) => {
                setLoading(true);
                dispatch(forgotPasswordApi(data)).then((req) => {
                  if (req.payload.appstatus === true) {
                    navigation.navigate("Confirmation");
                    Alert.alert(req.payload.message);
                    setLoading(false);
                  } else if (req.payload.appEmail === true) {
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

export default ForgotPasswordScreen;
