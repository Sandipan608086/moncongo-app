import * as React from "react";
import { View, SafeAreaView, StyleSheet, FlatList, Text, Image } from "react-native";
// import { Appbar, Avatar, Button, Card, Surface } from "react-native-paper";
import { useSelector } from "react-redux";
import { WebView } from 'react-native-webview';

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

const BusinessVideoRoute = () => {
  const BUSINESSHOME = useSelector(state => state.businessDetails.businesshome.directory_video);

  const _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <WebView
        source={{ html: getYouTubeHTML(item.directory_video_url), baseUrl: 'https://www.youtube-nocookie.com' }}
        style={{ marginBottom: 10, height: 210 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      {BUSINESSHOME.length > 0 ? <FlatList
        showsVerticalScrollIndicator={true}
        data={BUSINESSHOME}
        renderItem={_renderItem}
        keyExtractor={(item) => item.directory_video_id}
        numColumns={1}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 0 }}
      /> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Image alt="image" style={{ width: 500, height: 500 }} source={require('../../assets/noData.png')} /></View>}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(248, 248, 248, 1)",
    flex: 1,
    padding: 10,
  },
})
export default BusinessVideoRoute;