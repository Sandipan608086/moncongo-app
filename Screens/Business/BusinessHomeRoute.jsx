import * as React from "react";
import * as Linking from "expo-linking";
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
  Dimensions,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Surface,
  IconButton,
} from "react-native-paper";
import Swiper from "react-native-swiper";
import {
  Address,
  Phone,
  Email,
  Website,
  Share,
  Location,
} from "../../Navigation/Icon";
import { useSelector } from "react-redux";
const BusinessHomeRoute = () => {
  const { width, height } = Dimensions.get("window");
  const BUSINESSHOME = useSelector(
    (state) => state.businessDetails.businesshome
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.ScrollView}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      >
        {BUSINESSHOME.left_banner_data && (
          <Swiper
            style={styles.wrapper}
            height={300}
            showsButtons={true}
            autoplay
          >
            {BUSINESSHOME.left_banner_data.map((data, i) => {
              return (
                <Pressable style={styles.slide} key={i} onPress={() => Linking.openURL(data?.app_url)}>
                  <Image alt="image" style={styles.image} source={{ uri: data?.image }} />
                </Pressable>
              )
            })}
          </Swiper>
        )}
        <View style={styles.info}>
          {BUSINESSHOME.directory_address && (
            <View style={{ paddingVertical: 5, flexDirection: "row" }}>
              <Location size={24} color="white" />
              <Text style={styles.text}>{BUSINESSHOME.directory_address}</Text>
            </View>
          )}
          {BUSINESSHOME.directory_contact[0].contact != "" &&
            BUSINESSHOME.directory_contact.map((value, i) => {
              return (
                <Pressable
                  key={i}
                  onPress={() => Linking.openURL(`tel:${value.contact}`)}
                  style={{ paddingVertical: 5, flexDirection: "row" }}
                >
                  <Phone size={21} color="white" />
                  <Text style={styles.text}>{value.contact}</Text>
                </Pressable>
              );
            })}
          {BUSINESSHOME.directory_email &&
            Object.entries(BUSINESSHOME.directory_email[0]).map(
              ([key, value], i) => {
                return (
                  value && (
                    <Pressable
                      key={i}
                      onPress={() => Linking.openURL(`mailto:${value}`)}
                      style={{ paddingVertical: 10, flexDirection: "row" }}
                    >
                      <Email size={21} color="white" />
                      <Text style={[styles.text, { marginLeft: 4 }]}>{value}</Text>
                    </Pressable>
                  )
                );
              }
            )}
          {BUSINESSHOME.directory_website_url && (
            <Pressable
              onPress={() =>
                Linking.openURL(BUSINESSHOME.directory_website_url)
              }
              style={{ paddingVertical: 10, flexDirection: "row" }}
            >
              <Website size={21} color="white" />
              <Text style={styles.text}>
                {BUSINESSHOME.directory_website_url}
              </Text>
            </Pressable>
          )}
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#56b5db33", marginBottom: 10 }}>
          {BUSINESSHOME.directory_facebook !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image alt="image"
                  source={{ uri: BUSINESSHOME.icon.facebook }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(BUSINESSHOME.directory_facebook)}
            />
          )}
          {BUSINESSHOME.directory_twitter !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image alt="image"
                  source={{ uri: BUSINESSHOME.icon.twitter }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(BUSINESSHOME.directory_twitter)}
            />
          )}
          {BUSINESSHOME.directory_instagram !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image alt="image"
                  source={{ uri: BUSINESSHOME.icon.instagram }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() =>
                Linking.openURL(BUSINESSHOME.directory_instagram)
              }
            />
          )}
          {BUSINESSHOME.directory_linkdin !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image alt="image"
                  source={{ uri: BUSINESSHOME.icon.linkdin }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(BUSINESSHOME.directory_linkdin)}
            />
          )}
          {BUSINESSHOME.directory_youtube !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image alt="image"
                  source={{ uri: BUSINESSHOME.icon.youtube }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(BUSINESSHOME.directory_youtube)}
            />
          )}
        </View>
        {BUSINESSHOME.flier_banner && (
          <Swiper
            showsButtons={true}
            style={{ height: (1200 * width) / 850 }}
            autoplay
          >
            {BUSINESSHOME.flier_banner.map((value, i) => {
              return (
                <View style={styles.slide} key={i}>
                  <Image alt="image"
                    resizeMode="contain"
                    style={styles.image}
                    source={{ uri: value }}
                  />
                </View>
              );
            })}
          </Swiper>
        )}
        {BUSINESSHOME.bottom_banner && (
          <Surface style={{ height: 80, marginBottom: 50 }}>
            <Image alt="image"
              style={{
                display: "flex",
                height: "100%",
                width: "100%",
                marginTop: 10,
                marginBottom: 20,
              }}
              source={{ uri: BUSINESSHOME.bottom_banner }}
            />
          </Surface>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ScrollView: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  wrapper: {},
  slide: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  image: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    backgroundColor: "#0298d3",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
    // marginBottom: 10,
  },
  text: {
    paddingHorizontal: 11,
    color: "white",
    fontFamily: 'Poppins_400Regular'
  },
});

export default BusinessHomeRoute;
