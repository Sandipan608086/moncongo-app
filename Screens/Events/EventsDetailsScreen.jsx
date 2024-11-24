import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  FlatList,
  RefreshControl,
  Image,
  useWindowDimensions,
  Share,
  Platform,
  Pressable,
  Dimensions
} from "react-native";
import * as Linking from "expo-linking";
import * as Calendar from "expo-calendar";
import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Card,
  Text,
  IconButton,
  Button,
  FAB,
  Modal,
  MD2Colors,
  Icon,
} from "react-native-paper";
import Swiper from "react-native-swiper";
import { WebView } from "react-native-webview";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { useSelector, useDispatch } from "react-redux";
import CardListCom from "../../component/CardListCom";
import CardBusiness from "../../component/CardBusiness";
import AppbarHeader from "../../component/Appbar";
import { eventsDetailApi, eventsOther } from "../../store/EventsSlices";
import { useIsFocused } from "@react-navigation/native";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const EventsDetailsScreen = ({ navigation, route }) => {
  const systemFonts = [
    ...defaultSystemFonts,
    "Poppins_400Regular",
    "Poppins_700Bold",
  ];
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const routeData = JSON.parse(route.params);
  //Model Start
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { height: Dimensions.get('window').height };
  //Model End
  const [EVENTDATA, setEVENTDATA] = useState("");
  const BUSINESS = useSelector((state) => state.events.business);
  const EOTHERLIST = useSelector((state) => state.events.eventList);
  const LODING = useSelector((state) => state.events.loading);

  const [loading, setLoading] = useState(false);

  const [eventIdInCalendar, setEventIdInCalendar] = useState("");

  const onRefresh = () => {
    dispatch(eventsDetailApi({ slug: routeData.slug })).then((req) => {
      setEVENTDATA(req.payload);
      dispatch(eventsOther({ slug: routeData.slug }));
    }, []);
  };
  useEffect(() => {
    if (isFocused === true) {
      onRefresh();
    }
    // return () => { };
  }, [isFocused]);
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const onShare = async (url) => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // Alert.alert(error.message);
      Alert.alert(url);
    }
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardListCom item={item} slug={"EventsDetails"} navigation={navigation} />
    </View>
  );
  const { width } = useWindowDimensions();

  // async function getDefaultCalendarSource() {
  //   const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  //   return defaultCalendar.source;
  // }
  async function getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendars = calendars.filter(
      (each) => each.source.name === "Default"
    );
    return defaultCalendars.length
      ? defaultCalendars[0].source
      : calendars[0].source;
  }
  const [CALENDARID, setCALENDARID] = useState("");
  useEffect(() => {
    (async function () {
      try {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === "granted") {
          const calenderName = "MoncongoCalendar";
          function r() {
            return Math.floor(Math.random() * 256);
          }
          const color = "rgb(" + r() + "," + r() + "," + r() + ")";
          const defaultCalendarSource =
            Platform.OS === "ios"
              ? await getDefaultCalendarSource()
              : { isLocalAccount: true, name: calenderName };
          const calendars = await Calendar.getCalendarsAsync();
          // console.log(calendars);
          const moncongoCalendar = calendars.find(
            (calendar) => calendar.title == calenderName
          );
          if (moncongoCalendar != undefined) {
            setCALENDARID(moncongoCalendar.id);
          } else {
            const newCalendarID = await Calendar.createCalendarAsync({
              title: calenderName,
              color: color,
              entityType: Calendar.EntityTypes.EVENT,
              sourceId: defaultCalendarSource.id,
              source: defaultCalendarSource,
              name: "internalCalendarName",
              ownerAccount: "personal",
              accessLevel: Calendar.CalendarAccessLevel.OWNER,
            });
            setCALENDARID(newCalendarID);
          }
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [CALENDARID]);
  const addEventToCalendar = async (event) => {
    // const calenderName = "MoncongoCalendar";
    // function r() {
    //   return Math.floor(Math.random() * 256);
    // }
    if (EVENTDATA.event_date) {
      setLoading(true);
      const ed = EVENTDATA.event_date_ori;
      const events = [];
      for (let i = 0; i < ed.length; i++) {
        const eventDetails = {
          title: event.event_title,
          startDate: new Date(ed[i]),
          endDate: new Date(ed[i]),
          location: event.event_location,
        };
        const eventIdInCalendar = await Calendar.createEventAsync(
          CALENDARID,
          eventDetails
        );
        // Calendar.openEventInCalendar();
        setEventIdInCalendar(eventIdInCalendar);
      }
      Alert.alert(
        "La date de l'événement est enregistrée dans votre calendrier."
      );
      setLoading(false);
    } else {
      // const color = "rgb(" + r() + "," + r() + "," + r() + ")";
      setLoading(true);
      const eventDetails = {
        title: event.event_title,
        startDate: new Date(event.event_start_date),
        endDate: event.event_end_date
          ? new Date(event.event_end_date)
          : new Date(event.event_start_date),
        location: event.event_location,
      };
      // console.log(`Your new calendar ID is: ${CALENDARID}`);
      const eventIdInCalendar = await Calendar.createEventAsync(
        CALENDARID,
        eventDetails
      );
      Calendar.openEventInCalendar(eventIdInCalendar); // that will give the user the ability to access the event in phone calendar
      setEventIdInCalendar(eventIdInCalendar);
      Platform.OS === "ios" &&
        Alert.alert(
          "La date de l'événement est enregistrée dans votre calendrier."
        );
      setLoading(false);
    }

    // const calendars = await Calendar.getCalendarsAsync();
    // // console.log(calendars);
    // const moncongoCalendar = calendars.find(
    //   (calendar) => calendar.title == calenderName
    // );
    // console.log(moncongoCalendar);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Événement"
        back={true}
        home={true}
        navigation={navigation}
      />
      <ScrollView
        style={styles.ScrollView}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        refreshControl={
          <RefreshControl refreshing={LODING} onRefresh={onRefresh} />
        }
      >
        <View style={styles.ScrollView}>
          {EVENTDATA && (
            <View>
              <Text style={styles.Title}>{EVENTDATA.event_title}</Text>
              <Card style={{ marginTop: 20 }}>
                {EVENTDATA.event_main_img ? (
                  <Pressable onPress={showModal}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image alt="image"
                        style={{ height: 200, width: "100%" }}
                        source={{
                          uri: `https://i.ytimg.com/vi/${EVENTDATA.event_main_img}/hqdefault.jpg`,
                        }}
                      />
                      <Avatar.Icon
                        style={{
                          position: "absolute",
                          backgroundColor: "rgba(0,0,0,0)",
                        }}
                        size={130}
                        icon="play-circle"
                        color={MD2Colors.red800}
                      />
                    </View>
                  </Pressable>
                ) : (
                  EVENTDATA.event_img && (
                    <Swiper
                      style={styles.wrapper}
                      height={340}
                      showsButtons={true}
                      autoplay
                    >
                      {EVENTDATA.event_img.map((value, i) => {
                        return (
                          <View style={styles.slide} key={i}>
                            <Image alt="image"
                              resizeMode="cover"
                              style={styles.image}
                              source={{ uri: value.img }}
                            />
                          </View>
                        );
                      })}
                    </Swiper>
                  )
                )}
                <Text style={styles.date}>
                  Date de l’événement: {EVENTDATA.event_start_date_new}{" "}
                  {EVENTDATA.event_end_date_new &&
                    `to ${EVENTDATA.event_end_date_new}`}
                </Text>
                {EVENTDATA.event_date && (
                  <Text style={[styles.date, { paddingTop: 0 }]}>
                    Jours de la semaine: {EVENTDATA.event_date}
                  </Text>
                )}
              </Card>

              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  marginTop: 20,
                }}
              >
                Événement
              </Text>
              <View
                style={{ backgroundColor: "white", backgroundColor: "#ebf8ff" }}
              >
                {EVENTDATA.clean_description != "" && (
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: EVENTDATA.clean_description
                        ? EVENTDATA.clean_description
                        : "",
                    }}
                    tagsStyles={mixedStyle}
                    systemFonts={systemFonts}
                  />
                )}
                {EVENTDATA.event_location !== "" && (
                  <View
                    style={{
                      flexDirection: "row",
                      marginBottom: 10,
                      marginLeft: 15,
                    }}
                  >
                    {/* <Location size={24} color="black" /> */}
                    <Icon source="map-marker-outline" size={24} />
                    <Text style={{ width: "90%", fontSize: 14 }}>
                      {EVENTDATA.event_location}
                    </Text>
                  </View>
                )}
                {/* <Button style={{ marginBottom: 10 }} mode="contained" onPress={() => onShare(EVENTDATA.event_share)}>Ajouter au calendrier</Button> */}
                <Button
                  style={[g.Btn, { marginBottom: 15, marginHorizontal: 15 }]}
                  mode="contained"
                  onPress={() => addEventToCalendar(EVENTDATA)}
                  loading={loading}
                  disabled={loading}
                >
                  Enregistrer dans mon calendrier
                </Button>
              </View>

              {EVENTDATA.event_company > 0 && (
                <CardBusiness
                  BUSINESS={BUSINESS}
                  title={"Organisateur"}
                  navigation={navigation}
                />
              )}
            </View>
          )}
          {EOTHERLIST && (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins_700Bold",
                  marginTop: 20,
                }}
              >
                VOUS SEREZ ÉGALEMENT INTÉRESSÉ PAR
              </Text>
              <FlatList
                horizontal={true}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                data={EOTHERLIST}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.event_id}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <FAB.Group
        open={open}
        visible
        icon={open ? "close" : "contacts-outline"}
        backdropColor="rgba(0,0,0,0)"
        color="#ffffff"
        fabStyle={{ backgroundColor: "#0298d3" }}
        actions={[
          {
            icon: "email",
            label: "Email",
            color: "#ffffff",
            style: { backgroundColor: "#0298d3" },
            onPress: () =>
              BUSINESS.directory_email[0].email !== ""
                ? Linking.openURL(`mailto:${BUSINESS.directory_email[0].email}`)
                : Alert.alert("Désolé! Aucune adresse e-mail trouvée"),
            labelStyle: styles.fabLabelStyle,
          },
          {
            icon: "phone",
            label: "Appel",
            color: "#ffffff",
            style: { backgroundColor: "#0298d3" },
            onPress: () =>
              BUSINESS.directory_contact.length > 0
                ? Linking.openURL(
                  `tel:${BUSINESS.directory_contact[0].contact}`
                )
                : Alert.alert("Désolé! Aucun numéro de contact trouvé"),
            labelStyle: styles.fabLabelStyle,
          },
          {
            icon: "whatsapp",
            label: "WhatsApp",
            onPress: () =>
              BUSINESS.directory_whatsapp !== ""
                ? Linking.openURL(
                  `https://wa.me/${BUSINESS.directory_whatsapp}`
                )
                : Alert.alert("Désolé! Aucun contact WhatsApp trouvé"),
            color: "#ffffff",
            style: { backgroundColor: "#64B161" },
            labelStyle: styles.fabLabelStyle,
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
          }
        }}
      />
      <Modal visible={visible} style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <IconButton style={{ backgroundColor: 'white', position: 'absolute', top: 10, right: 0 }} icon="close-circle" size={30} iconColor="#0287BC" onPress={() => setVisible(false)} />

        <View style={{ height: 280 }}>
          <WebView
            style={{ height: 280 }}
            source={{ uri: `https://www.youtube.com/embed/${EVENTDATA.event_main_img}` }}
            androidHardwareAccelerationDisabled={true}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  ScrollView: {
    flex: 1,
    padding: 10,
  },
  Title: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    textTransform: "uppercase",
  },
  CardCover: {
    borderRadius: 0,
    height: 300,
  },
  ToggleButton: {
    backgroundColor: "#fff",
    margin: 0,
  },
  fabLabelStyle: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  date: {
    display: "flex",
    backgroundColor: "#0298d3",
    color: "#ffffff",
    padding: 10,
  },
  wrapper: {},
  slide: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  image: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
});

export default EventsDetailsScreen;
