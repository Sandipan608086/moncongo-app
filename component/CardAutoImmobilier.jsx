import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  Linking,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  MD3Colors,
  Card,
  Button,
  Text,
  List,
  Icon,
  DataTable,
} from "react-native-paper";
import {
  Details,
  Category,
  ShareIcon,
  Phone,
  DetailsAuto,
} from "../Navigation/Icon";
import Ionicons from "react-native-vector-icons/Ionicons";
const CardAutoImmobilier = (props) => {
  // useEffect(() => {
  //   console.log(props.item);
  // });
  return (
    <Card
      style={{
        marginBottom: 20,
        backgroundColor:
          props.item.premium == "0"
            ? "#C7EFFC"
            : props.item.premium == "1"
            ? "#e8f4f8"
            : "#ffffff",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {/* {props.other} */}
        <Pressable
          style={{ width: "33%" }}
          onPress={() =>
            props.navigation.navigate(
              props.details,
              JSON.stringify({ slug: props.item.slug })
            )
          }
        >
          <Card.Cover
            style={styles.CardCover}
            source={
              props.item.list_image
                ? { uri: props.item.list_image }
                : require("../assets/noImage.png")
            }
          />
        </Pressable>
        {props.other === false &&
          (props.item.active == "1" && props.item.approval == "APPROVED" ? (
            <Avatar.Icon
              icon="check"
              size={32}
              style={{
                position: "absolute",
                top: 5,
                left: 5,
                backgroundColor: "green",
              }}
            />
          ) : (
            <Avatar.Icon
              icon={props.item.approval == "PENDING" ? "timer-sand" : "cancel"}
              size={32}
              style={{
                position: "absolute",
                top: 5,
                left: 5,
                backgroundColor:
                  props.item.approval == "PENDING" ? "blue" : "red",
              }}
            />
          ))}
        {/* {props.other === false && props.item.type && (
          <Text
            style={{
              position: "absolute",
              backgroundColor: "lightgreen",
              padding: 5,
              top: 91,
              width: "33%",
            }}
          >
            {props.item.type == "rent" ? "Rent" : "Sale"}
          </Text>
        )} */}
        <View style={{ width: "66%" }}>
          <Card.Title
            title={props.item.title}
            titleStyle={{ fontFamily: "Poppins_700Bold" }}
            style={{ padding: 0, margin: 0 }}
          />
          <List.Section style={{ margin: 0, padding: 0 }}>
            <List.Item
              title={<Text>{props.item.address}</Text>}
              titleStyle={{ marginLeft: -12 }}
              style={{ padding: 0, marginTop: -30 }}
              left={(props) => (
                <List.Icon {...props} style={{marginLeft: 12}} icon="map-marker-outline" />
              )}
            />
            {props.brand === true && (
              <List.Item
                title={props.item.brand_title}
                titleStyle={{ marginLeft: -12 }}
                style={{ padding: 0, marginTop: -20, marginLeft: 0 }}
                left={(props) => (
                  <List.Icon {...props} icon="tag-multiple-outline" />
                )}
              />
            )}
            {props.payment === true && (
              <List.Item
                title={`$${props.item.price}${
                  props.item.type == "rent" ? "/mois" : ""
                }${props.item.negotiable == "yes" ? "/Négotiable" : ""}`}
                titleStyle={{ fontSize: 16 }}
                style={{ padding: 0, marginTop: -20 }}
              />
            )}
          </List.Section>
        </View>
      </View>
      {props.other != false && (
        <Card.Actions>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <DetailsAuto size={21} color="#666666" />}
            style={{ width: "36%", alignItems: "flex-start", paddingStart: 13 }}
            onPress={() =>
              props.navigation.navigate(
                props.details,
                JSON.stringify({ slug: props.item.slug })
              )
            }
          >
            En savoir plus
          </Button>
          <Button
            mode="text"
            textColor="#666666"
            icon={({ size, color }) => (
              <Ionicons name="logo-whatsapp" size={21} color="#666666" />
            )}
            style={{ width: "32%", alignItems: "center" }}
            onPress={() =>
              props.item.whatsapp !== ""
                ? Linking.openURL(`https://wa.me/${props.item.whatsapp}`)
                : Alert.alert("Désolé! Aucun contact WhatsApp trouvé")
            }
          >
            WhatsApp
          </Button>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <Phone size={18} color="#666666" />}
            style={{ width: "31%", alignItems: "flex-end" }}
            onPress={() =>
              props.item.contact !== ""
                ? Linking.openURL(`tel:${props.item.contact}`)
                : Alert.alert("Désolé! Aucun numéro de contact trouvé")
            }
          >
            Appel
          </Button>
        </Card.Actions>
      )}
      {props.footerText != false && (
        <Card.Actions>
          {props.item.premium && (
            <View style={{ flex: 2 }}>
              <Text Style={{ fontFamily: "Poppins_700Bold", marginRight: 10 }}>
                Référencement:
              </Text>
              <Text>
                {props.item.premium == "1"
                  ? "En Vedette"
                  : props.item.premium == "0"
                  ? "Parrainer"
                  : "Général"}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text Style={{ fontFamily: "Poppins_700Bold", marginRight: 10 }}>
              Vendue:
            </Text>
            <Text>{props.item.is_sold == "0" ? "Non" : "Oui"}</Text>
          </View>
          {props.item.type != "" && (
            <View style={{ flex: 1 }}>
              <Text Style={{ fontFamily: "Poppins_700Bold", marginRight: 10 }}>
                Taper:
              </Text>
              <Text>{props.item.type == "rent" ? "Louer" : "Vendre"}</Text>
            </View>
          )}
        </Card.Actions>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  CardCover: {
    width: "100%",
    height: 120,
    borderRadius: 0,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 0,
  },
});

export default CardAutoImmobilier;
