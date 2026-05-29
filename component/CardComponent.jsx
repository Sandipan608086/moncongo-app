import * as React from "react";
import {
  StyleSheet,
  Share,
  Alert,
  Linking,
  Pressable,
  ImageBackground,
} from "react-native";
import { Button, Text, Avatar, Surface, Card } from "react-native-paper";
import { Details, Category, ShareIcon } from "../Navigation/Icon";
// import { WebView } from 'react-native-webview';
// import {
//   useFonts,
//   Poppins_400Regular,
//   Poppins_700Bold,
// } from "@expo-google-fonts/poppins";
const CardComponent = (props) => {
  // const [fontsLoaded, fontError] = useFonts({
  //   Poppins_400Regular,
  //   Poppins_700Bold,
  // });
  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: props.item.url,
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
  const MyWebComponent = (event) => {
    if (event.slice(0, 4) === "http") {
      Linking.openURL(event);
      return false;
    }
    return true;
  };
  return (
    <Card
      mode="elevation"
      elevation={5}
      style={{
        borderRadius: 0,
        backgroundColor: "#ffffff",
        marginBottom: 20,
        fontFamily: "Poppins_400Regular",
      }}
    >
      <Card.Title
        title={props.item.title}
        subtitle={props.item.date}
        titleStyle={{ fontFamily: "Poppins_700Bold" }}
        subtitleStyle={{ fontFamily: "Poppins_400Regular" }}
        left={() => (
          <Avatar.Image
            size={48}
            source={
              props.item.logo_img
                ? { uri: props.item.logo_img }
                : require("../assets/noImage.png")
            }
          />
        )}
      />
      <Pressable
        onPress={() =>
          props.item.link
            ? MyWebComponent(props.item.link)
            : props.navigation.navigate(
                props.details,
                JSON.stringify({ slug: props.item.slug })
              )
        }
      >
        {/* <Card.Cover
          source={props.item.image ? { uri: props.item.image } : require("../assets/noImage.png")}
          style={{ borderRadius: 0, height: 340, }}
        /> */}
        <ImageBackground
          source={
            props.item.image
              ? { uri: props.item.image }
              : require("../assets/noImage.png")
          }
          resizeMode="contain"
          style={{ flex: 1, justifyContent: "center", height: 370 }}
        ></ImageBackground>
      </Pressable>
      {props.item.description && (
        <Text
          variant="bodyMedium"
          style={{ padding: 10, fontFamily: "Poppins_400Regular" }}
        >
          {props.item.description}
        </Text>
      )}
      {props.button == false ? (
        <Card.Actions>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <Details />}
            style={{
              width: "33%",
              alignItems: "flex-start",
              fontFamily: "Poppins_400Regular",
            }}
            onPress={() => console.log("Details")}
          >
            Read more
          </Button>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <Category />}
            style={{
              width: "33%",
              alignItems: "center",
              fontFamily: "Poppins_400Regular",
            }}
            onPress={() => console.log("Category")}
          >
            Category
          </Button>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <ShareIcon />}
            style={{
              width: "33%",
              alignItems: "flex-end",
              fontFamily: "Poppins_400Regular",
            }}
            onPress={() => onShare()}
          >
            Share
          </Button>
        </Card.Actions>
      ) : (
        <Card.Actions>
          {props.item.link ? (
            <Button
              mode="text"
              textColor="#666666"
              icon={() => <Details />}
              style={{
                width: "50%",
                alignItems: "flex-start",
                paddingStart: 12,
                fontFamily: "Poppins_400Regular",
              }}
              onPress={() => MyWebComponent(props.item.link)}
            >
              Link
            </Button>
          ) : (
            <Button
              mode="text"
              textColor="#666666"
              icon={() => <Details />}
              style={{
                width: "50%",
                alignItems: "flex-start",
                paddingStart: 12,
                fontFamily: "Poppins_400Regular",
              }}
              onPress={() =>
                props.navigation.navigate(
                  props.details,
                  JSON.stringify({ slug: props.item.slug })
                )
              }
            >
              Read More
            </Button>
          )}
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <ShareIcon />}
            style={{
              width: "50%",
              alignItems: "flex-end",
              fontFamily: "Poppins_400Regular",
            }}
            onPress={() => onShare()}
          >
            Share
          </Button>
        </Card.Actions>
      )}
    </Card>
  );
};

export default CardComponent;
