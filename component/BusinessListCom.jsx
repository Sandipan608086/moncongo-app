import * as React from "react";
import * as Linking from "expo-linking";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  Share,
  Platform,
  Pressable,
} from "react-native";
import {
  Button,
  Text,
  Avatar,
  Surface,
  Card,
  List,
  Menu,
  IconButton,
  Icon,
} from "react-native-paper";
import {
  Address,
  Phone,
  Email,
  Website,
  ShareIcon,
  Location,
} from "../Navigation/Icon";

const BusinessListCom = (props) => {
  const [geocode] = React.useState(props.data.geocode);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: props.data.share_url,
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
    props.data && (
      <Card
        mode="elevation"
        elevation={5}
        style={{
          borderRadius: 0,
          backgroundColor:
            props.data.directory_paid == "paid" ? "#56b5db33" : "#ffffff",
          marginBottom: 10,
        }}
      >
        <Pressable
          onPress={() =>
            props.navigation.navigate(
              "BusinessDetails",
              JSON.stringify({ slug: props.data.directory_slug })
            )
          }
        >
          <Card.Title
            title={props.data.directory_title}
            titleStyle={{ fontWeight: "bold" }}
            left={(prop) => (
              <Avatar.Image
                {...prop}
                size={48}
                source={
                  props.data.logo
                    ? { uri: props.data.logo }
                    : require("../assets/noImage.png")
                }
              />
            )}
          />
        </Pressable>
        <View style={{ paddingHorizontal: 20 }}>
          {props.data.directory_contact[0].contact != "" &&
            props.data.directory_contact.map((value, i) => {
              return (
                value.contact && (
                  <Pressable
                    key={i}
                    onPress={() => Linking.openURL(`tel:${value.contact}`)}
                  >
                    <View style={{ paddingVertical: 5, flexDirection: "row" }}>
                      {/* <Phone size={19} color="#000000" /> */}
                      <Icon source="phone-outline" size={24} />
                      <Text style={{ paddingHorizontal: 8 }}>
                        {value.contact}
                      </Text>
                    </View>
                  </Pressable>
                )
              );
            })}
          {props.data.directory_email &&
            Object.entries(props.data.directory_email[0]).map(
              ([key, value], i) => {
                return (
                  value && (
                    <Pressable
                      key={i}
                      onPress={() => Linking.openURL(`mailto:${value}`)}
                    >
                      <View
                        key={i}
                        style={{ paddingVertical: 5, flexDirection: "row" }}
                      >
                        {/* <Email size={19} color="#000000" /> */}
                        <Icon source="email-outline" size={24} />
                        <Text style={{ paddingHorizontal: 8 }}>{value}</Text>
                      </View>
                    </Pressable>
                  )
                );
              }
            )}
          {/* {props.data.directory_address !== "" && (
            <View style={{ paddingVertical: 5, flexDirection: "row" }}>
              <Icon
                source="map-marker-outline"
                size={24}
              />
              <Text style={{ paddingHorizontal: 8 }}>
                {props.data.directory_address},{" "}
                {props.data.directory_citie_title}
              </Text>
            </View>
          )} */}
          {props.data.directory_address !== "" && (
            <View style={{ paddingVertical: 5, flexDirection: "row" }}>
              <Icon source="map-marker-outline" size={24} />
              <Text
                style={{ paddingHorizontal: 8 }}
                onPress={() =>
                  geocode
                    ? Platform.OS == "ios"
                      ? Linking.openURL(
                          `http://maps.apple.com/?ll=${geocode.lat},${geocode.lng}&z=15&t=m&q=${geocode.lat},${geocode.lng}`
                        )
                      : Linking.openURL(
                          `https://maps.google.com/?q=${geocode.lat},${geocode.lng}&z=15`
                        )
                    : {}
                }
              >
                {props.data.directory_address},{" "}
                {props.data.directory_citie_title}
              </Text>
            </View>
          )}
        </View>
        <Card.Actions>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <Address size={20} color="#666666" />}
            style={{ width: "38%", alignItems: "flex-start", paddingStart: 20 }}
            onPress={() =>
              props.navigation.navigate(
                "BusinessDetails",
                JSON.stringify({ slug: props.data.directory_slug })
              )
            }
          >
            Info
          </Button>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <Phone size={19} color="#666666" />}
            style={{ width: "27%", alignItems: "center" }}
            onPress={() =>
              props.data.directory_contact.length > 0
                ? Linking.openURL(
                    `tel:${props.data.directory_contact[0].contact}`
                  )
                : Alert.alert("Sorry! No contact number found.")
            }
          >
            Call
          </Button>
          {/* (Platform.OS === 'ios')  */}
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <ShareIcon size={20} color="#666666" />}
            style={{ width: "35%", alignItems: "flex-end" }}
            onPress={() => onShare()}
          >
            Share
          </Button>
        </Card.Actions>
      </Card>
    )
  );
};

export default BusinessListCom;
