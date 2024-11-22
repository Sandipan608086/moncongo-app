import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  FlatList,
  RefreshControl,
  useWindowDimensions,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Text,
  ToggleButton,
  IconButton,
  FAB,
  Button,
  List,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { tendersDetailApi, tendersOther } from "../../store/TendersSlices";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import CardListCom from "../../component/CardListCom";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const TendersDetailScreen = ({ navigation, route }) => {
  const systemFonts = [...defaultSystemFonts, "Poppins_400Regular",'Poppins_700Bold'];
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const routeData = JSON.parse(route.params);
  // const TENDERDATA = useSelector(state => state.tender.tendersDetail);
  const [TENDERDATA, setTENDERDATA] = useState("");
  const TOTHERLIST = useSelector((state) => state.tender.tendersList);
  const LODING = useSelector((state) => state.tender.loading);
  useEffect(() => {
    onRefresh();
    return () => {};
  }, []);
  const onRefresh = () => {
    dispatch(tendersDetailApi({ slug: routeData.slug })).then((req) => {
      setTENDERDATA(req.payload);
      dispatch(tendersOther({ slug: routeData.slug }));
    });
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardListCom item={item} slug={"TenderDetails"} navigation={navigation} />
    </View>
  );
  const { width } = useWindowDimensions();
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: TENDERDATA.url,
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
      Alert.alert(error.message);
    }
  };
  const downloadFile = async (e) => {
    try {
      const result = await Share.share({
        message: e,
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
      Alert.alert(error.message);
    }
    // const source = "https://www.africau.edu/images/default/sample.pdf";
    // let dirs = ReactNativeBlobUtil.fs.dirs;
    // ReactNativeBlobUtil.config({
    //     fileCache: true,
    //     appendExt: 'pdf',
    //     path: source,
    //     addAndroidDownloads: {
    //         useDownloadManager: true,
    //         notification: true,
    //         title: fileName,
    //         description: 'File downloaded by download manager.',
    //         mime: 'application/pdf',
    //     },
    // })
    //     .fetch('GET', fileUrl)
    //     .then((res) => {
    //         if (Platform.OS === 'ios') {
    //             const filePath = res.path();
    //             let options = {
    //                 type: 'application/pdf',
    //                 url: filePath,
    //                 saveToFiles: true,
    //             };
    //             Share.open(options)
    //                 .then((resp) => console.log(resp))
    //                 .catch((err) => console.log(err));
    //         }
    //     })
    //     .catch((err) => console.log('BLOB ERROR -> ', err));
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Appels d’Offre"
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
        {TENDERDATA && (
          <View style={styles.ScrollView}>
            <Text style={styles.Title}>{TENDERDATA.tender_title}</Text>
            <Card style={{ marginTop: 20 }}>
              <Card.Cover
                style={styles.CardCover}
                source={
                  TENDERDATA.tender_list_img != ""
                    ? { uri: TENDERDATA.tender_list_img }
                    : require("../../assets/noImage.png")
                }
              />
              <Text style={styles.date}>
                Date de clôture: {TENDERDATA.tender_closing_date}
              </Text>
            </Card>
            <View style={{ backgroundColor: "#ebf8ff", marginTop: 20 }}>
              {TENDERDATA.tender_company && (
                <List.Item
                  title="Entreprise:"
                  titleStyle={{ fontFamily: "Poppins_700Bold" }}
                  description={TENDERDATA.tender_company}
                />
              )}
              {TENDERDATA.tender_reference && (
                <List.Item
                  style={{ marginTop: -20 }}
                  title="Référence:"
                  titleStyle={{ fontFamily: "Poppins_700Bold" }}
                  description={TENDERDATA.tender_reference}
                />
              )}
              {TENDERDATA.tender_citie_title && (
                <List.Item
                  style={{ marginTop: -20 }}
                  title="Lieu:"
                  titleStyle={{ fontFamily: "Poppins_700Bold" }}
                  description={TENDERDATA.tender_address}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins_700Bold",
                marginTop: 20,
              }}
            >
              L’appel d’offre
            </Text>
            <View style={{ backgroundColor: "#ebf8ff" }}>
              {TENDERDATA.clean_description != "" && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: TENDERDATA.clean_description
                      ? TENDERDATA.clean_description
                      : "",
                  }}
                  tagsStyles={mixedStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
            {TENDERDATA.tender_doc && (
              <View
                style={{
                  backgroundColor: "#ebf8ff",
                  padding: 10,
                  marginTop: 20,
                }}
              >
                <Text style={styles.Text}>
                  Téléchargez les documents de l’appel d’offre
                </Text>
                <View>
                  {TENDERDATA.tender_doc &&
                    TENDERDATA.tender_doc.map((value, i) => {
                      return (
                        <Button
                          onPress={() => downloadFile(value)}
                          key={i}
                          mode="contained"
                          style={[g.Btn, { width: "100%" }]}
                        >
                          Télécharger
                        </Button>
                      );
                    })}
                </View>
              </View>
            )}
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
                data={TOTHERLIST}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.tender_id}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <FAB
        icon="share"
        style={styles.fab}
        color="#ffffff"
        onPress={() => onShare()}
      />
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    alignItems: "flex-end",
    backgroundColor: "#0298d3",
  },
  date: {
    display: "flex",
    backgroundColor: "#0298d3",
    color: "#ffffff",
    padding: 10,
  },
  Text: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    margin: 0,
  },
});
export default TendersDetailScreen;
