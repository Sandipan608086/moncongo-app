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

const getYouTubeVideoId = (urlOrId) => {
  if (!urlOrId) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(String(urlOrId).trim())) return String(urlOrId).trim();
  const match = String(urlOrId).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : String(urlOrId).trim();
};

const getYouTubeHTML = (videoIdOrUrl) => {
  const id = getYouTubeVideoId(videoIdOrUrl);
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;width:100%;height:100%}html,body{height:100%}iframe{display:block;width:100%;height:100%;border:none}</style></head><body><iframe src="https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0&modestbranding=1" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></body></html>`;
};

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
  const _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardListCom item={item} slug={"EventsDetails"} navigation={navigation} />
    </View>
  );
  const { width } = useWindowDimensions();

  async function getDefaultCalendarSource() {
    if (Platform.OS === "ios") {
    // Use Expo's dedicated native calendar lookup for Apple devices
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  } else {
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
  }
  const [CALENDARID, setCALENDARID] = useState("");
  useEffect(() => {
  (async function initializeCalendar() {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calenderName = "WhizzTanzaniaCalendar";
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        
        const moncongoCalendar = calendars.find(
          (calendar) => calendar.title == calenderName
        );

        if (moncongoCalendar != undefined) {
          setCALENDARID(moncongoCalendar.id);
        } else {
          function r() {
            return Math.floor(Math.random() * 256);
          }
          const color = "rgb(" + r() + "," + r() + "," + r() + ")";
          const defaultCalendarSource = await getDefaultCalendarSource();

          const newCalendarID = await Calendar.createCalendarAsync({
            title: calenderName,
            color: color,
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource ? defaultCalendarSource.id : undefined,
            source: defaultCalendarSource,
            name: "internalCalendarName",
            ownerAccount: "personal",
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
          setCALENDARID(newCalendarID);
        }
      }
    } catch (e) {
      console.log("Calendar initialization failed: ", e);
    }
  })();
}, []);
  const addEventToCalendar = async (event) => {
    if (!EVENTDATA) return;
    setLoading(true);
    try 
    {
      let targetCalendarId = CALENDARID;
      if (!targetCalendarId) {
        const defaultNativeCal = await Calendar.getDefaultCalendarAsync();
        targetCalendarId = defaultNativeCal.id;
      }

      if (EVENTDATA.event_date) {
        
       const ed = EVENTDATA.event_date_ori;
      
      for (let i = 0; i < ed.length; i++) {
        
        // Safe string parsing isolates dates from UTC midnight shifting
        const [year, month, day] = ed[i].split("-").map(Number); 
        
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
        
        // Scan the target calendar for existing events in this window
        const existingEvents = await Calendar.getEventsAsync(
          [targetCalendarId],
          startOfDay,
          endOfDay
        );

        // Optional chaining (?.) prevents crashes on untitled calendar slots
        const isDuplicate = existingEvents.some(
          (e) => e.title?.toLowerCase() === event.event_title?.toLowerCase()
        );

        if (isDuplicate) {
          continue; // Skip creation and jump to the next date in the loop
        }

        const eventDetails = {
          title: event.event_title,
          startDate: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
          location: event.event_location,
          allDay: true, // Safeguards iOS timeline drawing
        }; 
        const eventIdInCalendar = await Calendar.createEventAsync(targetCalendarId, eventDetails); 
        setEventIdInCalendar(eventIdInCalendar);
       }
        Alert.alert("Success", "The event date is saved in your calendar.");
      }
      else
      {
       const [sYear, sMonth, sDay] = event.event_start_date.split("-").map(Number);
       const searchStart = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);

       let eYear = sYear, eMonth = sMonth, eDay = sDay;
       if (event.event_end_date) {
        [eYear, eMonth, eDay] = event.event_end_date.split("-").map(Number);
       }
       const searchEnd = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999);

       const existingEvents = await Calendar.getEventsAsync(
        [targetCalendarId],
        searchStart,
        searchEnd
      );

      const isDuplicate = existingEvents.some(
        (e) => e.title?.toLowerCase() === event.event_title?.toLowerCase()
      );

      if (!isDuplicate) {
        const eventDetails = {
          title: event.event_title,
          startDate: new Date(Date.UTC(sYear, sMonth - 1, sDay, 0, 0, 0, 0)),
          endDate: new Date(Date.UTC(eYear, eMonth - 1, eDay, 0, 0, 0, 0)),
          location: event.event_location,
          allDay: true,
        };

        const eventIdInCalendar = await Calendar.createEventAsync(
          targetCalendarId,
          eventDetails
        );
        setEventIdInCalendar(eventIdInCalendar);
        if (Platform.OS === "ios") {
          Calendar.openEventInCalendar(eventIdInCalendar);
        } else {
          Alert.alert("Success", "The event date is saved in your calendar.");
        }
      }
     } 
    }
    catch (error) {
    console.log("Error writing event to native calendar app: ", error);
    Alert.alert("Calendar Error", "Unable to save this event directly to your system calendar configuration.");
  } finally {
    setLoading(false);
  } 
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Event"
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
                  Event date: {EVENTDATA.event_start_date_new}{" "}
                  {EVENTDATA.event_end_date_new &&
                    `to ${EVENTDATA.event_end_date_new}`}
                </Text>
                {EVENTDATA.event_date && (
                  <Text style={[styles.date, { paddingTop: 0 }]}>
                    Days: {EVENTDATA.event_date}
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
                Event
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
                  Save to my calendar
                </Button>
              </View>

              {EVENTDATA.event_company > 0 && (
                <CardBusiness
                  BUSINESS={BUSINESS}
                  title={"Organizer"}
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
                YOU MAY ALSO BE INTERESTED IN
              </Text>
              <FlatList
                horizontal={true}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                data={EOTHERLIST}
                renderItem={_renderItem}
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
            label: "Call",
            color: "#ffffff",
            style: { backgroundColor: "#0298d3" },
            onPress: () =>
              BUSINESS.directory_contact.length > 0
                ? Linking.openURL(
                  `tel:${BUSINESS.directory_contact[0].contact}`
                )
                : Alert.alert("Sorry! No contact number found"),
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
                : Alert.alert("Sorry! No WhatsApp contact found"),
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
            source={{ html: getYouTubeHTML(EVENTDATA.event_main_img), baseUrl: 'https://www.youtube-nocookie.com' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']}
            mixedContentMode="compatibility"
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
