import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  RefreshControl,
  FlatList,
} from "react-native";
import * as React from "react";
import { Appbar, Surface, Text, Button, Avatar, Icon } from "react-native-paper";

import {
  Directory,
  Announcements,
  Promotions,
  Events,
  Tenders,
  Jobs,
  Coupons,
  Cars,
  Property,
  News,
  Horoscope,
} from "../Navigation/Icon";
import AppbarHeader from "../component/Appbar";

import { useSelector, useDispatch } from "react-redux";
import { otherMenuApi } from "./../store/OtherSlices";

const MenuScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const OTHERMENU = useSelector((state) => state.other.otherMenu);
  const LODING = useSelector((state) => state.other.loading);
  React.useEffect(() => {
    onRefresh();
    return () => { };
  }, []);
  const onRefresh = () => {
    dispatch(otherMenuApi());
  };
  const generateColor = () => {
    const CHHAPOLA = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${CHHAPOLA}`;
  };
  const _renderItem = ({ item }) => (
    <View style={{ flex: 0.5, width: "100%" }}>
      <Pressable
        style={[styles.surface2, { paddingVertical: 20 }]}
        onPress={() =>
          navigation.navigate(
            "Other",
            JSON.stringify({
              slug: item.others_pages_slug,
              name: item.others_pages_title,
            })
          )
        }
        elevation={5}
      >
        {item.other_img ? <Icon style={{ textAlign: "center", backgroundColor: "rgba(0,0,0,0)", borderRadius: 0, overflow: "hidden" }} size={64} source={{ uri: item.other_img }} /> : <Text
          style={{
            width: 60,
            height: 60,
            paddingTop: 8,
            backgroundColor: generateColor(),
            color: "#ffffff",
            fontSize: 24,
            fontFamily: "Poppins_700Bold",
            borderRadius: 20,
            textAlign: "center",
          }}
        >
          {item.title_word}
        </Text>}
        <Text style={{ marginTop: 30, fontSize: 14, textAlign: "center" }}>
          {item.others_pages_title}
        </Text>
      </Pressable>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Menu"
        back={false}
        home={false}
        logo={true}
        navigation={navigation}
      />
      <ScrollView
        style={styles.view}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl refreshing={LODING} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: "row" }}>
          <Pressable
            style={[styles.surface]}
            onPress={() => navigation.navigate("Business")}
            elevation={5}
          >
            <Directory />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Directory</Text>
          </Pressable>
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Announcement")}
            elevation={5}
          >
            <Announcements />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Announcements</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Promotion")}
            elevation={5}
          >
            <Promotions />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Promotions</Text>
          </Pressable>
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Events")}
            elevation={5}
          >
            <Events />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Events</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Tender")}
            elevation={5}
          >
            <Tenders />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Tenders</Text>
          </Pressable>
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Autos")}
            elevation={5}
          >
            <Cars />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Cars</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Property")}
            elevation={5}
          >
            <Property />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Properties</Text>
          </Pressable>
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Job")}
            elevation={5}
          >
            <Jobs />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Jobs</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          
          <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("Horoscope")}
            elevation={5}
          >
            <Horoscope />
            <Text style={{ marginTop: 25, fontSize: 14 }}>Horoscope</Text>
          </Pressable>
           <Pressable
            style={styles.surface}
            onPress={() => navigation.navigate("SOS")}
            elevation={5}
          >
            <News />
            <Text style={{ marginTop: 25, fontSize: 14 }}>SOS</Text>
          </Pressable>
        </View>
        <View>
          <FlatList
            scrollEnabled={false}
            onEndReachedThreshold={0}
            data={OTHERMENU.data}
            renderItem={_renderItem}
            keyExtractor={(item) => item.others_pages_id}
            numColumns={2}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 0 }}
          />
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
    paddingHorizontal: 10,
    marginTop: 10,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: "#ffffff",
  },
  surface: {
    margin: 10,
    padding: 15,
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    height: 150,
    backgroundColor: "#ffffff",
  },
  surface2: {
    margin: 10,
    padding: 15,
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  others: {
    margin: 9,
    // padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    // height: 150,
    backgroundColor: "#ffffff",
  },
  flexView: {
    flexDirection: "column",
    flex: 0.7,
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});

export default MenuScreen;
