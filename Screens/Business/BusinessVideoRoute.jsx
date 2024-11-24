import * as React from "react";
import { View, SafeAreaView, StyleSheet, FlatList, Text, Image } from "react-native";
// import { Appbar, Avatar, Button, Card, Surface } from "react-native-paper";
import { useSelector } from "react-redux";
import { WebView } from 'react-native-webview';
const BusinessVideoRoute = () => {
  const BUSINESSHOME = useSelector(state => state.businessDetails.businesshome.directory_video);

  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <WebView
        source={{ uri: `https://www.youtube.com/embed/${item.directory_video_url}` }}
        style={{ marginBottom: 10, height: 210 }}
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      {BUSINESSHOME.length > 0 ? <FlatList
        showsVerticalScrollIndicator={true}
        data={BUSINESSHOME}
        renderItem={this._renderItem}
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