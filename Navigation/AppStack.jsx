import React, { useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { navigate } from "./RootNavigation";

import * as Notifications from "expo-notifications";
import {
  notificatioToken,
  notificationTestApi,
} from "./../store/NotificationSlices";
import { tokenApi } from "./../store/UserSlices";
import { getMessaging, getToken, setAPNSToken, requestPermission, onNotificationOpenedApp, onMessage, AuthorizationStatus } from "@react-native-firebase/messaging";

import HomeScreen from "../Screens/HomeScreen";
import MenuScreen from "../Screens/MenuScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import SettingScreen from "../Screens/SettingScreen";
import SearchScreen from "../Screens/SearchScreen";
import BusinessScreen from "../Screens/BusinessScreen";
import BusinessListScreen from "../Screens/Business/BusinessListScreen";
import BusinessDetailsScreen from "../Screens/Business/BusinessDetailsScreen";
import BusinessSubCategoryScreen from "../Screens/Business/BusinessSubCategoryScreen";
import AnnouncementScreen from "../Screens/Announcements";
import AnnouncementDetailsScreen from "../Screens/Announcements/AnnouncementDetailsScreen";
import PromotionsScreen from "../Screens/Promotions";
import PromotionsDetailsScreen from "../Screens/Promotions/PromotionsDetailsScreen";
import EventsScreen from "../Screens/Events";
import EventsDetailsScreen from "../Screens/Events/EventsDetailsScreen";
import HoroscopeScreen from "../Screens/Horoscope";
import HoroscopeDetaIlsScreen from "../Screens/Horoscope/HoroscopeDetaIlsScreen";
import NewsScreen from "../Screens/News";
import NewsDetailsScreen from "../Screens/News/NewsDetailsScreen";
import SosScreen from "../Screens/SOS";
import TendersScreen from "./../Screens/Tenders";
import TendersDetailScreen from "./../Screens/Tenders/TendersDetailsScreen";
import JobsScreen from "./../Screens/Jobs";
import JobsDetailScreen from "./../Screens/Jobs/JobsDetailsScreen";
import JobsForm from "./../Screens/Jobs/JobsFormScreen";
import CouponsScreen from "./../Screens/Coupons";
import CouponsDetails from "./../Screens/Coupons/CouponsDetailsScreen";
import CouponsOtpScreen from "./../Screens/Coupons/CouponsOTPScreen";
import CouponsApplyScreen from "./../Screens/Coupons/CouponsApplyScreen";
import AutoScreen from "./../Screens/Auto";
import AutoDetail from "./../Screens/Auto/AutoDetailsScreen";
import PropertyScreen from "../Screens/Property";
import PropertyDetails from "../Screens/Property/PropertyDetailsScreen";
import OtherList from "../Screens/Others";
import OtherDetails from "../Screens/Others/OtherDetailsScreen";
import SettingPageScreen from "../Screens/Settings/SettingPageScreen";

//User Screen
import LoginScreen from "../Screens/Users/LoginScreen";
import RegisterScreen from "../Screens/Users/RegisterScreen";
import OtpScreen from "../Screens/Users/OtpScreen";
import ForgotPasswordScreen from "../Screens/Users/ForgotPasswordScreen";
import ConfirmationScreen from "../Screens/Users/ConfirmationScreen";
import ListAutoScreen from "../Screens/Users/ListAutoScreen";
import ListPropertyScreen from "../Screens/Users/ListPropertyScreen";
import AddProfileScreen from "../Screens/Users/AddProfileScreen";
import AddAutoScreen from "../Screens/Users/AddAutoScreen";
import AddPropertyScreen from "../Screens/Users/AddPropertyScreen";
import ImageAutoScreen from "../Screens/Users/ImageAutoScreen";
import ImagePropertyScreen from "../Screens/Users/ImagePropertyScreen";
import ChangeMyPasswordScreen from "../Screens/Users/ChangeMyPassword";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const TabRoutes = () => {
  const userKey = useSelector((state) => state.user.userKey);

  const homeName = "Home";
  const menuName = "Menu";
  const searchName = "Search";
  const profileName = "Profile";
  const settingName = "Settings";
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#c7efff",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: {
          padding: 10,
          height: Platform.OS === "ios" ? 90 : 70,
          backgroundColor: "#0298d3",
        },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === menuName) {
            iconName = focused ? "grid" : "grid-outline";
          } else if (rn === searchName) {
            iconName = focused ? "search" : "search-outline";
          } else if (rn === profileName) {
            iconName = focused ? "person-circle" : "person-circle-outline";
          } else if (rn === settingName) {
            iconName = focused ? "settings" : "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={homeName}
        component={HomeScreen}
      // listeners={({ navigation }) => ({
      //   tabPress: () => {
      //     if (navigation.isFocused()) {
      //       navigation.replace("Dashboard");
      //     }
      //   },
      // })}
      />
      <Tab.Screen name={menuName} component={MenuScreen} />
      <Tab.Screen name={searchName} component={SearchScreen} />
      <Tab.Screen
        name={profileName}
        component={userKey ? ProfileScreen : LoginScreen}
      />
      <Tab.Screen name={settingName} component={SettingScreen} />
    </Tab.Navigator>
  );
};

export const AppStack = () => {
  const dispatch = useDispatch();

  const tokenLoad = async () => {
    try {
      const platform = Platform.OS;
      const messagingInstance = getMessaging();

      // On iOS, expo-notifications gives us the raw APNs token.
      // We hand it to Firebase via setAPNSToken() so that getToken()
      // can succeed without waiting for Firebase's own APNs registration.
      if (platform === "ios") {
        const apnsTokenObj = await Notifications.getDevicePushTokenAsync();
        const rawApnsToken = apnsTokenObj?.data;
        if (rawApnsToken) {
          await setAPNSToken(messagingInstance, rawApnsToken);
          //console.log("APNs token registered with Firebase.");
        } else {
          //console.log("APNs token object returned empty data.");
        }
      }

      const token = await getToken(messagingInstance);
      if (token) {
        console.log("FCM Generated Successfully", `Token: ${token.substring(0, 15)}... Platform: ${platform}`);
        dispatch(tokenApi({ key: token, type: platform }));
        dispatch(notificatioToken(token));
      }
      else
      {
        //console.log("FCM Token Generation Failed", "No token returned from getToken().");
      }
    } catch (e) {
      //console.log("Native Token Error", e.message || String(e));
    }
  };

  async function requestUserPermission() {
    if (Platform.OS === "android") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        tokenLoad();
      }
      return;
    }
    // iOS — Firebase handles the system permission dialog
    const authStatus = await requestPermission(getMessaging());
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //console.log("iOS Authorization status:", authStatus);
      await tokenLoad();
    }
  }
  useEffect(() => {
    // On Android we can get the token immediately (no permission dialog needed pre-Android 13)
    // On iOS, getToken() requires permission first — tokenLoad() is called inside requestUserPermission()
    if (Platform.OS === "android") {
      tokenLoad();
    }
    requestUserPermission();
    // Set up the notification handler for the app
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    // Handle user clicking on a notification and open the screen
    const handleNotificationClick = async (response) => {
      const data = response?.notification?.request?.content?.data;
      if (data?.type) {
        navigate(
          data.type,
          JSON.stringify({ slug: data.slug ?? null })
        );
      }
    };
    // Listen for user clicking on a notification
    const notificationClickSubscription =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationClick
      );
    // Handle user opening the app from a notification (background state)
    onNotificationOpenedApp(getMessaging(), (remoteMessage) => {
      try {
        if (remoteMessage?.data?.type) {
          setTimeout(() => {
            navigate(
              remoteMessage.data.type,
              JSON.stringify({ slug: remoteMessage.data.slug ?? null })
            );
          }, 1000);
        }
      } catch (e) {}
    });
    // Check if the app was opened from a notification (killed state)
    // Handled in NavigationContainer onReady in AppNav.jsx
    // Handle push notifications when the app is in the foreground
    const handlePushNotification = async (remoteMessage) => {
      try {
        const title =
          remoteMessage?.notification?.title ??
          remoteMessage?.data?.title ??
          "Notification";
        const body =
          remoteMessage?.notification?.body ??
          remoteMessage?.data?.body ??
          "";
        await Notifications.scheduleNotificationAsync({
          content: { title, body, data: remoteMessage?.data ?? {} },
          trigger: null,
        });
      } catch (e) {}
    };
    // Listen for push notifications when the app is in the foreground
    const unsubscribe = onMessage(getMessaging(), handlePushNotification);
    // Clean up the event listeners
    return () => {
      unsubscribe();
      notificationClickSubscription.remove();
    };
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard"
    >
      <Stack.Screen name="Dashboard" component={TabRoutes} />
      <Stack.Screen name="Business" component={BusinessScreen} />
      <Stack.Screen name="SubCategory" component={BusinessSubCategoryScreen} />
      <Stack.Screen name="BusinessList" component={BusinessListScreen} />
      <Stack.Screen name="BusinessDetails" component={BusinessDetailsScreen} />
      <Stack.Screen name="Announcement" component={AnnouncementScreen} />
      <Stack.Screen
        name="AnnouncementDetails"
        component={AnnouncementDetailsScreen}
      />
      <Stack.Screen name="Promotion" component={PromotionsScreen} />
      <Stack.Screen
        name="PromotionsDetails"
        component={PromotionsDetailsScreen}
      />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="EventsDetails" component={EventsDetailsScreen} />
      <Stack.Screen name="Horoscope" component={HoroscopeScreen} />
      <Stack.Screen
        name="HoroscopeDetails"
        component={HoroscopeDetaIlsScreen}
      />
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
      <Stack.Screen name="SOS" component={SosScreen} />
      <Stack.Screen name="Tender" component={TendersScreen} />
      <Stack.Screen name="TenderDetails" component={TendersDetailScreen} />
      <Stack.Screen name="Job" component={JobsScreen} />
      <Stack.Screen name="JobDetails" component={JobsDetailScreen} />
      <Stack.Screen name="JobForm" component={JobsForm} />
      <Stack.Screen name="Coupons" component={CouponsScreen} />
      <Stack.Screen name="CouponsDetails" component={CouponsDetails} />
      <Stack.Screen name="CouponsOtp" component={CouponsOtpScreen} />
      <Stack.Screen name="CouponsApply" component={CouponsApplyScreen} />
      <Stack.Screen name="Autos" component={AutoScreen} />
      <Stack.Screen name="AutosDetails" component={AutoDetail} />
      <Stack.Screen name="Property" component={PropertyScreen} />
      <Stack.Screen name="PropertyDetails" component={PropertyDetails} />
      <Stack.Screen name="Other" component={OtherList} />
      <Stack.Screen name="OtherDetails" component={OtherDetails} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="ChangeMyPassword"
        component={ChangeMyPasswordScreen}
      />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
      <Stack.Screen name="AddProfile" component={AddProfileScreen} />
      <Stack.Screen name="AddAuto" component={AddAutoScreen} />
      <Stack.Screen name="AddProperty" component={AddPropertyScreen} />
      <Stack.Screen name="ListAuto" component={ListAutoScreen} />
      <Stack.Screen name="ListProperty" component={ListPropertyScreen} />
      <Stack.Screen name="ImageAuto" component={ImageAutoScreen} />
      <Stack.Screen name="ImageProperty" component={ImagePropertyScreen} />
      <Stack.Screen name="SettingPage" component={SettingPageScreen} />
    </Stack.Navigator>
  );
};
