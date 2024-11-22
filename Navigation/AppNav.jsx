import { Alert, Platform, Text } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./AppStack";

import {
  configureFonts,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const AppNav = () => {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  if (!fontsLoaded && !fontError) {
    return null;
  }
  const baseFont = {
    fontFamily: "Poppins_400Regular",
  };

  // const fonts = configureFonts({ config: baseFont });
  const theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: baseFont }),
  };
  const defaultFont = Platform.select({
    ios: "Poppins_400Regular",
    android: "Poppins_400Regular",
    default: "Poppins_400Regular",
  });

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNav;
