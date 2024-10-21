import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  useWindowDimensions,
  Animated,
  Platform
} from "react-native";
import { useSelector } from "react-redux";
import APIURL from "../../store/Api";
import { FAB } from "react-native-paper";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Linking from "expo-linking";
const BusinessLocationRoute = () => {
  const BUSINESSHOME = useSelector(
    (state) => state.businessDetails.businesshome
  );
  const latitude =
    Object.keys(BUSINESSHOME.directory_location).length > 0
      ? BUSINESSHOME.directory_location.lat
      : "";
  const longitude =
    Object.keys(BUSINESSHOME.directory_location).length > 0
      ? BUSINESSHOME.directory_location.lng
      : "";
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
        {latitude !== "" ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
            zoomEnabled={true}
            maxZoomLevel={25}
            minZoomLevel={16}
          >
            <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
          </MapView>
        ) : (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Image
              style={{ width: 500, height: 500 }}
              source={require("../../assets/noData.png")}
            />
          </View>
        )}
        {latitude !== "" && (
          <FAB
            icon="directions"
            style={styles.fab}
            size={"small"}
            color={"#ffffff"}
            onPress={() => {
              return Platform.OS == 'ios' ? Linking.openURL(`http://maps.apple.com/?ll=${latitude},${longitude}&z=15&t=m&q=${latitude},${longitude}`) : Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}&z=15`);
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(248, 248, 248, 1)",
    flex: 1,
    // alignItems: 'center'
  },
  map: {
    width: "100%",
    height: "80%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    top: 0,
    right: 0,
    alignItems: "flex-end",
    backgroundColor: "#0298d3",
  },
});
export default BusinessLocationRoute;
