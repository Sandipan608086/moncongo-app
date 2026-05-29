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
  TouchableOpacity,
  Dimensions
} from "react-native";
import * as Linking from "expo-linking";
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
} from "react-native-paper";
import Swiper from "react-native-swiper";
import { WebView } from "react-native-webview";
import { useSelector, useDispatch } from "react-redux";

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
import { useIsFocused } from "@react-navigation/native";
import AppbarHeader from "../../component/Appbar";
import {
  announcementsDetailApi,
  announcementsOther,
} from "../../store/AnnouncementsSlices";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import CardListCom from "../../component/CardListCom";
import CardBusiness from "../../component/CardBusiness";
import { mixedStyle } from "./../../Navigation/htmlStyle";

const AnnouncementDetailsScreen = ({ navigation, route }, props) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const routeData = JSON.parse(route.params);

  const systemFonts = [
    ...defaultSystemFonts,
    "Poppins_400Regular",
    "Poppins_700Bold"
  ];
  //Model Start
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { height: Dimensions.get('window').height };
  //Model End
  // const ANNOUNCDATA = useSelector(state => state.announcement.announcementDetail);
  const [ANNOUNCDATA, setANNOUNCDATA] = useState("");
  const BUSINESS = useSelector((state) => state.announcement.business);
  const AOTHERLIST = useSelector(
    (state) => state.announcement.announcementList
  );
  const LODING = useSelector((state) => state.announcement.loading);
  const onRefresh = () => {
    dispatch(announcementsDetailApi({ slug: routeData.slug })).then((req) => {
      setANNOUNCDATA(req.payload);
      dispatch(announcementsOther({ slug: routeData.slug }));
    });
  };
  useEffect(() => {
    if (isFocused === true) {
      onRefresh();
    }
    // return () => {};
  }, [isFocused]);
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;
  const _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardListCom
        item={item}
        slug={"AnnouncementDetails"}
        navigation={navigation}
      />
    </View>
  );
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Annonce"
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
        {ANNOUNCDATA && (
          <View style={styles.ScrollView}>
            <Text style={styles.Title}>{ANNOUNCDATA.ann_title}</Text>
            <Card style={{ marginTop: 20 }}>
              {ANNOUNCDATA.ann_main_img ? (
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
                        uri: `https://i.ytimg.com/vi/${ANNOUNCDATA.ann_main_img}/hqdefault.jpg`,
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
                ANNOUNCDATA.ann_img && (
                  <Swiper
                    style={styles.wrapper}
                    height={340}
                    showsButtons={true}
                    autoplay
                  >
                    {ANNOUNCDATA.ann_img.map((value, i) => {
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
                Date de l’annonce: {ANNOUNCDATA.ann_start_date}{" "}
                {ANNOUNCDATA.ann_end_date && `to ${ANNOUNCDATA.ann_end_date}`}
              </Text>
            </Card>

            <Text
              style={{
                fontSize: 20,
                marginTop: 20,
                fontFamily: "Poppins_700Bold",
              }}
            >
              Annonce
            </Text>
            <View style={{ marginTop: 20, backgroundColor: "#ebf8ff" }}>
              {ANNOUNCDATA.clean_description != "" && (
                <RenderHtml
                  contentWidth={width}
                  source={{ html: ANNOUNCDATA.clean_description ? ANNOUNCDATA.clean_description : '' }}
                  tagsStyles={mixedStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
            <CardBusiness
              BUSINESS={BUSINESS}
              title={"Société"}
              navigation={navigation}
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                marginTop: 20,
              }}
            >
              VOUS SEREZ ÉGALEMENT INTÉRESSÉ PAR
            </Text>
            <View>
              <FlatList
                horizontal={true}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                data={AOTHERLIST}
                renderItem={_renderItem}
                keyExtractor={(item) => item.ann_id}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
              />
            </View>
          </View>
        )}
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
            // do something if the speed dial is open
          }
        }}
      />
      <Modal visible={visible} style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onDismiss={hideModal} contentContainerStyle={containerStyle}>
        <IconButton style={{ backgroundColor: 'white', position: 'absolute', top: 10, right: 0 }} icon="close-circle" size={30} iconColor="#0287BC" onPress={() => setVisible(false)} />

        <View style={{ height: 280 }}>
          <WebView
            style={{ height: 280 }}
            source={{ html: getYouTubeHTML(ANNOUNCDATA.ann_main_img), baseUrl: 'https://www.youtube-nocookie.com' }}
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
    textTransform: "uppercase",
    fontFamily: "Poppins_700Bold",
  },
  CardCover: {
    borderRadius: 0,
    height: 300,
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
    alignContent: "center",
  },
});
export default AnnouncementDetailsScreen;
