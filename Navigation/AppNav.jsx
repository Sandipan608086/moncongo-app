import { Alert, Platform, Text } from "react-native";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "./AppStack";
import { navigationRef, navigate } from "./RootNavigation";
import { getMessaging, getInitialNotification } from "@react-native-firebase/messaging";
import * as SplashScreen from "expo-splash-screen";

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

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

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
      <NavigationContainer
        ref={navigationRef}
        onReady={async () => {
          try {
            const remoteMessage = await getInitialNotification(getMessaging());
            if (remoteMessage?.data?.type) {
              navigate(
                remoteMessage.data.type,
                JSON.stringify({ slug: remoteMessage.data.slug ?? null })
              );
            }
          } catch (e) {}
        }}
      >
        <AppStack />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default AppNav;
