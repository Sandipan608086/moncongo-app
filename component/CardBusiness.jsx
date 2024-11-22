import React, { useEffect, useState } from "react";
import { View, Linking, StyleSheet, Image, Platform } from "react-native";
import {
  Avatar,
  Card,
  Text,
  ToggleButton,
  IconButton,
  Button,
  MD3Colors,
  Icon,
} from "react-native-paper";
import {
  Address,
  Phone,
  Email,
  Website,
  Share,
  Location,
} from "../Navigation/Icon";
const CardBusiness = (props) => {
  const [icon] = useState(props.BUSINESS.iconApp);
  const [geocode] = useState(props.BUSINESS.geocode);
  return (
    <View>
      <Text
        style={{ fontSize: 20, fontFamily: "Poppins_700Bold", marginTop: 20 }}
      >
        {props.title}
      </Text>
      <Card
        mode="elevation"
        elevation={5}
        style={{
          borderRadius: 0,
          backgroundColor: "#ebf8ff",
          marginTop: 10,
        }}
      >
        <Card.Title
          title={
            <Text
              style={{ fontFamily: "Poppins_700Bold", fontSize: 16 }}
              onPress={() =>
                props.navigation.navigate(
                  "BusinessDetails",
                  JSON.stringify({ slug: props.BUSINESS.directory_slug })
                )
              }
            >
              {props.BUSINESS.directory_title}
            </Text>
          }
          left={() => (
            <Avatar.Image
              size={48}
              source={
                props.BUSINESS.logo
                  ? { uri: props.BUSINESS.logo.img }
                  : require("../assets/noImage.png")
              }
            />
          )}
        />
        <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
          {props.BUSINESS.directory_address_mobile && (
            <View style={{ paddingVertical: 5, flexDirection: "row" }}>
              {/* <Phone size={21} color="black" /> */}
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
                {props.BUSINESS.directory_address_mobile}
              </Text>
            </View>
          )}
          {props.BUSINESS.directory_contact &&
            props.BUSINESS.directory_contact.map((value, i) => {
              return (
                value.contact && (
                  <View
                    key={i}
                    style={{ paddingVertical: 5, flexDirection: "row" }}
                  >
                    {/* <Phone size={21} color="black" /> */}
                    <Icon source="phone-outline" size={24} />
                    <Text
                      style={{ paddingHorizontal: 8 }}
                      onPress={() => Linking.openURL(`tel:${value.contact}`)}
                    >
                      {value.contact}
                    </Text>
                  </View>
                )
              );
            })}
          {/* {
              props.BUSINESS.directory_email && Object.entries(props.BUSINESS.directory_email[0]).map(([key, value], i) => {
                  return value && <View key={i} style={{ paddingVertical: 5, flexDirection: 'row' }}><Email size={21} color='black' /><Text style={{ paddingHorizontal: 11 }}>{value}</Text></View>
              })
          } */}
          {props.BUSINESS.directory_website_url && (
            <View style={{ paddingVertical: 5, flexDirection: "row" }}>
              {/* <Website size={21} color="black" /> */}
              <Icon source="web" size={24} />
              <Text
                style={{ paddingHorizontal: 8, width: "90%" }}
                onPress={() =>
                  Linking.openURL(props.BUSINESS.directory_website_url)
                }
              >
                {props.BUSINESS.directory_website_name}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          {props.BUSINESS.directory_facebook !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image
                  source={{ uri: icon.facebook }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(props.BUSINESS.directory_facebook)}
            />
          )}
          {props.BUSINESS.directory_twitter !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image
                  source={{ uri: icon.twitter }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(props.BUSINESS.directory_twitter)}
            />
          )}
          {props.BUSINESS.directory_instagram !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image
                  source={{ uri: icon.instagram }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() =>
                Linking.openURL(props.BUSINESS.directory_instagram)
              }
            />
          )}
          {props.BUSINESS.directory_linkdin !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image
                  source={{ uri: icon.linkdin }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(props.BUSINESS.directory_linkdin)}
            />
          )}
          {props.BUSINESS.directory_youtube !== "" && (
            <IconButton
              size={16}
              icon={() => (
                <Image
                  source={{ uri: icon.youtube }}
                  style={{ width: 25, height: 25 }}
                />
              )}
              onPress={() => Linking.openURL(props.BUSINESS.directory_youtube)}
            />
          )}
        </View>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  ToggleButton: {
    margin: 0,
    padding: 0,
  },
});
export default CardBusiness;
