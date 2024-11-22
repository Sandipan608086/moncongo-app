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
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { jobsDetailApi, jobsOther } from "../../store/JobsSlices";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import CardListCom from "../../component/CardListCom";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const JobsDetailScreen = ({ navigation, route }) => {
  const systemFonts = [...defaultSystemFonts, "Poppins_400Regular",'Poppins_700Bold'];
  const dispatch = useDispatch();
  const routeData = JSON.parse(route.params);
  // const JOBSDATA = useSelector(state => state.job.jobsDetail);
  const [JOBSDATA, setJOBSDATA] = useState("");
  const JOTHERLIST = useSelector((state) => state.job.jobsList);
  const LODING = useSelector((state) => state.job.loading);
  useEffect(() => {
    onRefresh();
    return () => {};
  }, []);
  const onRefresh = () => {
    dispatch(jobsDetailApi({ slug: routeData.slug })).then((req) => {
      setJOBSDATA(req.payload);
      dispatch(jobsOther({ slug: routeData.slug }));
    });
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardListCom item={item} slug={"JobDetails"} navigation={navigation} />
    </View>
  );
  const { width } = useWindowDimensions();
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: JOBSDATA.url,
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
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Offre d’emploi"
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
        {JOBSDATA && (
          <View style={styles.ScrollView}>
            <Text style={styles.Title}>{JOBSDATA.job_title}</Text>
            <Card style={{ marginTop: 20 }}>
              <Card.Cover
                style={styles.CardCover}
                source={
                  JOBSDATA.job_business_logo != ""
                    ? { uri: JOBSDATA.job_business_logo }
                    : require("../../assets/noImage.png")
                }
              />
              <Text style={styles.date}>
              Date de Clôture: {JOBSDATA.job_application_deadline}
              </Text>
            </Card>
            <View
              style={{ backgroundColor: "#ebf8ff", padding: 10, marginTop: 20 }}
            >
              {JOBSDATA.job_business_name && (
                <View>
                  <Text style={[styles.Text]}>
                    Recruteur:
                  </Text>
                  <Text style={{ fontSize: 14 }}>{JOBSDATA.job_business_name}</Text>
                </View>
              )}
              {JOBSDATA.job_citie_title && (
                <View>
                  <Text style={styles.Text}>Lieu:</Text>
                  <Text style={{ display: 'flex' }}>
                    {JOBSDATA.job_citie_title}
                  </Text>
                </View>
              )}
            </View>

            <View
              style={{
                backgroundColor: "#ebf8ff",
                marginTop: 20,
                paddingBottom: 10,
                paddingLeft: 10
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Poppins_700Bold",
                  marginTop: 20,
                  paddingLeft: 15,
                }}
              >
                Poste à pourvoir
              </Text>
              {JOBSDATA.clean_description != "" && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: JOBSDATA.clean_description
                      ? JOBSDATA.clean_description
                      : "",
                  }}
                  tagsStyles={mixedStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
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
                data={JOTHERLIST}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.job_id}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 10 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <FAB
        icon="application-settings"
        style={styles.fab}
        color="#ffffff"
        onPress={() =>
          navigation.navigate(
            "JobForm",
            JSON.stringify({ id: JOBSDATA.job_id })
          )
        }
      />
      <FAB
        icon="share"
        style={styles.share}
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
    textTransform: "capitalize",
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
  share: {
    position: "absolute",
    margin: 16,
    right: 70,
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
  },
});
export default JobsDetailScreen;
