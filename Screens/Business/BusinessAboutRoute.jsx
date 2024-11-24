import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  Image,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const BusinessAboutRoute = () => {
  const systemFonts = [...defaultSystemFonts, "Poppins_400Regular",'Poppins_700Bold'];
  const BUSINESSHOME = useSelector(
    (state) => state.businessDetails.businesshome
  );
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {BUSINESSHOME.directory_description != null ? (
          // <WebView
          //   originWhitelist={['*']}
          //   source={{ html: BUSINESSHOME.directory_description }}
          //   scalesPageToFit={false}
          //   showsVerticalScrollIndicator={true}
          //   showsHorizontalScrollIndicator={false}
          //   style={{ flex: 1, fontSize: 16, fontFamily: 'Poppins_400Regular'}}
          // />
          <RenderHtml
            contentWidth={width}
            source={{
              html: BUSINESSHOME.directory_description
                ? BUSINESSHOME.directory_description
                : "",
            }}
            tagsStyles={mixedStyle}
            systemFonts={systemFonts}
          />
        ) : (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Image alt="image"
              style={{ width: 500, height: 500 }}
              source={require("../../assets/noData.png")}
            />
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
    padding: 10,
  },
});
export default BusinessAboutRoute;
