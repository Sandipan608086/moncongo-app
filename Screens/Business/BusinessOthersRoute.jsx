import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  Image
} from "react-native";
import { Title } from "react-native-paper";
import { WebView } from 'react-native-webview';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { mixedStyle } from "./../../Navigation/htmlStyle";
import { useSelector } from "react-redux";

const BusinessOthersRoute = () => {
  const systemFonts = [...defaultSystemFonts, 'Poppins_400Regular','Poppins_700Bold'];
  const BUSINESSHOME = useSelector(state => state.businessDetails.businesshome);
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      {BUSINESSHOME.directory_tabData ?
        <View>
          <Title style={{margin: 10, fontFamily: 'Poppins_700Bold'}}>{BUSINESSHOME.directory_tabMenu}</Title>
          {/* <WebView
            originWhitelist={['*']}
            source={{ html: BUSINESSHOME.directory_tabData }}
            scalesPageToFit={false}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
          /> */}
          <RenderHtml
            contentWidth={width}
            source={{ html: BUSINESSHOME.directory_tabData ? BUSINESSHOME.directory_tabData : '' }}
            tagsStyles={mixedStyle}
            systemFonts={systemFonts}
          />
        </View> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Image alt="image" style={{ width: 500, height: 500 }} source={require('../../assets/noData.png')} /></View>}
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
export default BusinessOthersRoute;