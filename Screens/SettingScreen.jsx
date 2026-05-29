import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { Appbar, Card, Divider, List, Switch } from "react-native-paper";
import AppbarHeader from "../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { pageListApi, notificationApiOff } from "../store/SettingSlices";
// import * as Notifications from "expo-notifications";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
const SettingScreen = ({ navigation }) => {
  const g = require("../Navigation/Style");
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const PAGELIST = useSelector((state) => state.setting.pageList);
  const tokenKey = useSelector((state) => state.notification.tokenNot);

  const [annonces, setAnnonces] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [evenements, setEvenements] = useState(true);
  const [appelsoffre, setAppelsoffre] = useState(true);
  const [auto, setAuto] = useState(true);
  const [immobilier, setImmobilier] = useState(true);
  const [offresdemploi, setAffresdemploi] = useState(true);
  const [horoscope, setHoroscope] = useState(true);
  const [nouvelles, setNouvelles] = useState(true);
  // const [tokenKey, setTokenKey] = useState('');
  const onToggleSwitch = async (type) => {
    let Sw;
    if (type == "app_token_status") {
      setAnnonces(!annonces);
      Sw = !annonces;
    } else if (type == "app_token_status_promotion") {
      setPromotions(!promotions);
      Sw = !promotions;
    } else if (type == "app_token_status_events") {
      setEvenements(!evenements);
      Sw = !evenements;
    } else if (type == "app_token_status_tenders") {
      setAppelsoffre(!appelsoffre);
      Sw = !appelsoffre;
    } else if (type == "app_token_status_cars") {
      setAuto(!auto);
      Sw = !auto;
    } else if (type == "app_token_status_property") {
      setImmobilier(!immobilier);
      Sw = !immobilier;
    } else if (type == "app_token_status_jobs") {
      setAffresdemploi(!offresdemploi);
      Sw = !offresdemploi;
    } else if (type == "app_token_status_horoscope") {
      setHoroscope(!horoscope);
      Sw = !horoscope;
    } else if (type == "app_token_status_news") {
      setNouvelles(!nouvelles);
      Sw = !nouvelles;
    }
    dispatch(
      notificationApiOff({
        type: "editNotification",
        token: tokenKey,
        status: JSON.stringify(Sw),
        coltype: type,
      })
    ).then((req) => {
      // Alert.alert(req.payload.message);
      console.log(req.payload.message);
    });
  };
  const loadNoad = () => {
    dispatch(
      notificationApiOff({ type: "showNotification", token: tokenKey })
    ).then((req) => {
      setAnnonces(req.payload.app_token_status);
      setPromotions(req.payload.app_token_status_promotion);
      setEvenements(req.payload.app_token_status_events);
      setAppelsoffre(req.payload.app_token_status_tenders);
      setAuto(req.payload.app_token_status_cars);
      setImmobilier(req.payload.app_token_status_property);
      setAffresdemploi(req.payload.app_token_status_jobs);
      setHoroscope(req.payload.app_token_status_horoscope);
      setNouvelles(req.payload.app_token_status_news);
    });
  };
  useEffect(() => {
    (async function () {
      try {
        await dispatch(pageListApi());
      } catch (e) {
        console.log(e);
      }
    })();
    if (isFocused) {
      loadNoad();
    }
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Settings"
        back={false}
        home={false}
        logo={true}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={styles.view}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View>
          <List.Section>
            {PAGELIST.map((value, i) => {
              return (
                <List.Item
                  key={i}
                  style={styles.profileList}
                  titleStyle={{ color: "#ffffff" }}
                  title={value.ext_pages_name}
                  onPress={() =>
                    navigation.navigate(
                      "SettingPage",
                      JSON.stringify(value.ext_pages_slug)
                    )
                  }
                  right={() => (
                    <List.Icon color={"#ffffff"} icon="arrow-right-thin" />
                  )}
                />
              );
            })}
          </List.Section>
          <Divider style={{ marginTop: 10 }} />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
              marginTop: 10,
              fontFamily: "Poppins_700Bold",
            }}
          >
            Notification
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Announcements{" "}
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={annonces}
                onValueChange={() => onToggleSwitch("app_token_status")}
              />
            </View>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Promotions
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={promotions}
                onValueChange={() =>
                  onToggleSwitch("app_token_status_promotion")
                }
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Events
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={evenements}
                onValueChange={() => onToggleSwitch("app_token_status_events")}
              />
            </View>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Tenders
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={appelsoffre}
                onValueChange={() => onToggleSwitch("app_token_status_tenders")}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Vehicles
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={auto}
                onValueChange={() => onToggleSwitch("app_token_status_cars")}
              />
            </View>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Properties
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={immobilier}
                onValueChange={() =>
                  onToggleSwitch("app_token_status_property")
                }
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Jobs
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={offresdemploi}
                onValueChange={() => onToggleSwitch("app_token_status_jobs")}
              />
            </View>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Horoscope
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={horoscope}
                onValueChange={() =>
                  onToggleSwitch("app_token_status_horoscope")
                }
              />
            </View>
          </View>
          {/* <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={styles.surface}>
              <Text
                style={{
                  fontSize: 16,
                  flex: 0.7,
                  marginTop: Platform.OS === "ios" ? 6 : 0,
                }}
              >
                Nouvelles
              </Text>
              <Switch
                color="#0298d3"
                style={[styles.switch, { flex: 0.3 }]}
                value={nouvelles}
                onValueChange={() => onToggleSwitch("app_token_status_news")}
              />
            </View>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  view: {
    flex: 1,
    padding: 15,
  },
  header: {
    backgroundColor: "#ffffff",
  },
  profileView: {
    alignSelf: "center",
  },
  profileList: {
    backgroundColor: "#0298d3",
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  switch: {
    marginLeft: 10,
    marginRight: 5,
    alignItems: "right",
  },
  surface: {
    // margin: 10,
    // padding: 15,
    flexDirection: "row",
    flex: 0.5,
    // width: "100%",
  },
});

export default SettingScreen;
