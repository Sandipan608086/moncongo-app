import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Card, Avatar, List, Title } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { useSelector, useDispatch } from "react-redux";
import { pageDetailsApi } from "../../store/SettingSlices";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const SettingPageScreen = ({ navigation, route }) => {
  const systemFonts = [...defaultSystemFonts, "Poppins_400Regular",'Poppins_700Bold'];
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  const routeData = JSON.parse(route.params);
  const PAGEDETAILS = useSelector((state) => state.setting.pageDetails);
  useEffect(() => {
    (async function () {
      try {
        await dispatch(pageDetailsApi({ slug: routeData }));
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Settings"
        back={true}
        home={false}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={styles.view}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {PAGEDETAILS.ext_pages_data != null && (
          <View style={{ backgroundColor: "white", padding: 10 }}>
            <Title style={{marginBottom: 20, fontFamily: 'Poppins_700Bold'}}>{PAGEDETAILS.ext_pages_name}</Title>
            <RenderHtml
              contentWidth={width}
              source={{
                html: PAGEDETAILS.ext_pages_data
                  ? PAGEDETAILS.ext_pages_data
                  : "",
              }}
              tagsStyles={mixedStyle}
              systemFonts={systemFonts}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  view: {
    flex: 1,
    padding: 15,
  },
});
