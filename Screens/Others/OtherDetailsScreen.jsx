import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  RefreshControl,
  useWindowDimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Text, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { otherDetailApi } from "../../store/OtherSlices";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const OtherDetails = ({ navigation, route }) => {
  const systemFonts = [
    ...defaultSystemFonts,
    "Poppins_400Regular",
    "Poppins_700Bold",
  ];
  const dispatch = useDispatch();
  const routeData = JSON.parse(route.params);
  // const OTHERDATA = useSelector(state => state.other.otherDetail);
  const [OTHERDATA, useOTHERDATA] = useState("");
  const LODING = useSelector((state) => state.other.loading);
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  useEffect(() => {
    onRefresh();
    return () => {};
  }, []);
  const onRefresh = () => {
    dispatch(otherDetailApi({ slug: routeData.slug })).then((req) => {
      useOTHERDATA(req.payload);
    });
  };
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title={OTHERDATA.others_pages_title}
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
        {OTHERDATA && (
          <View style={styles.ScrollView}>
            <Text style={styles.Title}>{OTHERDATA.others_list_title}</Text>
            <Card style={{ marginTop: 20 }}>
              <Card.Cover
                style={styles.CardCover}
                source={
                  OTHERDATA.others_list_main_img != ""
                    ? { uri: OTHERDATA.others_list_main_img }
                    : require("../../assets/noImage.png")
                }
              />
            </Card>
            <View style={{ backgroundColor: "#ebf8ff", marginTop: 20 }}>
              {OTHERDATA.others_list_long_description != "" && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: OTHERDATA.others_list_long_description
                      ? OTHERDATA.others_list_long_description
                      : "",
                  }}
                  tagsStyles={mixedStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
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
});
export default OtherDetails;
