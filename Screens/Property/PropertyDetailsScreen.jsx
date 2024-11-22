import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  RefreshControl,
  useWindowDimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Text, FAB } from "react-native-paper";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import Swiper from "react-native-swiper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { propertyDetailApi } from "../../store/PropertySlices";
import { Location } from "../../Navigation/Icon";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const PropertyDetails = ({ navigation, route }) => {
  const systemFonts = [
    ...defaultSystemFonts,
    "Poppins_400Regular",
    "Poppins_700Bold",
  ];
  const dispatch = useDispatch();
  const routeData = JSON.parse(route.params);
  // const PROPERTYDATA = useSelector(state => state.property.propertyDetail);
  const [PROPERTYDATA, setPROPERTYDATA] = useState("");
  const LODING = useSelector((state) => state.property.loading);
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  useEffect(() => {
    onRefresh();
    return () => { };
  }, []);
  const onRefresh = () => {
    dispatch(propertyDetailApi({ slug: routeData.slug })).then((req) => {
      setPROPERTYDATA(req.payload.data);
    });
  };
  const DataValue = PROPERTYDATA
    ? [
      {
        id: 9,
        icon: "home",
        name: "Taper",
        value: PROPERTYDATA.property_category_name,
      },
      {
        id: 1,
        icon: "bed-king-outline",
        name: "Chambres",
        value: PROPERTYDATA.property_bedrooms,
      },
      {
        id: 2,
        icon: "bathtub-outline",
        name: "S. de Bain",
        value: PROPERTYDATA.property_bathrooms,
      },
      {
        id: 3,
        icon: "border-none-variant",
        name: "Dimensions",
        value: `${PROPERTYDATA.property_unit_of_area} ㎡`,
      },
      {
        id: 4,
        icon: "chair-rolling",
        name: "Meublé",
        value: `${PROPERTYDATA.property_furnished === "yes" ? "Oui" : "Non"}`,
      },
      {
        id: 5,
        icon: "elevator-passenger-outline",
        name: "Ascenseur",
        value: `${PROPERTYDATA.property_lift === "yes" ? "Oui" : "Non"}`,
      },
      {
        id: 6,
        icon: "boom-gate-outline",
        name: "Parking",
        value: `${PROPERTYDATA.property_parking === "yes" ? "Oui" : "Non"}`,
      },
      {
        id: 7,
        icon: "car-battery",
        name: "Groupe électrogène",
        value: `${PROPERTYDATA.property_generator === "yes" ? "Oui" : "Non"}`,
      },
      {
        id: 8,
        icon: "security",
        name: "Sécurité",
        value: `${PROPERTYDATA.property_security === "yes" ? "Oui" : "Non"}`,
      },
      {
        id: 9,
        icon: "shield-home-outline",
        name: "Publié par",
        value: PROPERTYDATA.property_listed,
      },
    ]
    : [];
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Immobilier"
        back={true}
        home={true}
        navigation={navigation}
      />
      <ScrollView
        style={styles.ScrollView}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        refreshControl={
          <RefreshControl refreshing={LODING} onRefresh={onRefresh} />
        }
      >
        {PROPERTYDATA && (
          <View>
            {PROPERTYDATA.flier_image && (
              <Swiper
                style={styles.wrapper}
                height={350}
                showsButtons={true}
                autoplay
              >
                {PROPERTYDATA.flier_image.map((value, i) => {
                  return (
                    <Card
                      key={i}
                      mode="elevated"
                      style={{
                        backgroundColor: "#fff",
                        marginBottom: 20,
                        height: 350,
                      }}
                    >
                      <Card.Cover
                        source={{ uri: value }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Card>
                  );
                })}
              </Swiper>
            )}
            <Text style={[styles.Title, { marginTop: 10 }]}>
              {PROPERTYDATA.property_title}
            </Text>
            {PROPERTYDATA.property_price !== '--' ? <View style={{ flexDirection: "row" }}>
              <Text style={[styles.Title, { marginVertical: 10 }]}>
                ${PROPERTYDATA.property_price}
              </Text>
              <Text style={{ marginTop: 18 }}>
                {PROPERTYDATA.property_type == "rent" && "/mois"}
              </Text>
            </View> : <View style={{ flexDirection: 'row' }}><Text style={[{ marginVertical: 10 }]}>Contactez le vendeur pour le prix</Text></View>}
            {PROPERTYDATA.property_address && (
              <View
                style={{
                  paddingVertical: 5,
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <Location size={24} color="black" />
                <Text style={{ paddingHorizontal: 11, fontSize: 16 }}>
                  {PROPERTYDATA.property_address}
                </Text>
              </View>
            )}
            <View style={{ flex: 1, flexWrap: "wrap", flexDirection: "row" }}>
              {DataValue &&
                DataValue.map((data, i) => {
                  return (
                    <View style={{ flexBasis: "47%", margin: 5 }} key={i}>
                      <Card
                        mode="elevated"
                        style={{ backgroundColor: "#ebf8ff", flex: 1 }}
                      >
                        <Card.Title
                          title={data.name}
                          titleStyle={{ textTransform: "capitalize", fontSize: 14 }}
                          subtitle={
                            <Text
                              style={{
                                textTransform: "capitalize",
                                fontFamily: "Poppins_700Bold",
                                fontSize: 12
                              }}
                            >
                              {data.value}
                            </Text>
                          }
                          left={(props) => (
                            <Avatar.Icon
                              style={{ backgroundColor: "#007096" }}
                              {...props}
                              icon={data.icon}
                            />
                          )}
                        />
                      </Card>
                    </View>
                  );
                })}
            </View>
            <View
              style={{
                backgroundColor: "#ebf8ff",
                padding: 10,
                marginVertical: 20,
              }}
            >
              {PROPERTYDATA.property_long_text != "" && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: PROPERTYDATA.property_long_text
                      ? PROPERTYDATA.property_long_text
                      : "",
                  }}
                  tagsStyles={mixedStyle}
                  systemFonts={systemFonts}
                />
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <FAB.Group
        open={open}
        visible
        icon={open ? "close" : "contacts-outline"}
        backdropColor="rgba(0,0,0,0)"
        color="#ffffff"
        fabStyle={{ backgroundColor: "#0298d3" }}
        actions={[
          {
            icon: "phone",
            label: "Appel",
            color: "#ffffff",
            style: { backgroundColor: "#0298d3" },
            onPress: () =>
              PROPERTYDATA.property_mobile
                ? Linking.openURL(`tel:${PROPERTYDATA.property_mobile}`)
                : Alert.alert("Désolé! Aucun numéro de contact trouvé"),
            labelStyle: styles.fabLabelStyle,
          },
          {
            icon: "whatsapp",
            label: "WhatsApp",
            onPress: () =>
              PROPERTYDATA.property_whatsapp !== ""
                ? Linking.openURL(
                  `https://wa.me/${PROPERTYDATA.property_whatsapp}`
                )
                : Alert.alert("Désolé! Aucun contact WhatsApp trouvé"),
            color: "#ffffff",
            style: { backgroundColor: "#64B161" },
            labelStyle: styles.fabLabelStyle,
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  ScrollView: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 150,
  },
  Title: {
    fontSize: 22,
    fontFamily: "Poppins_700Bold",
    textTransform: "uppercase",
  },
  CardCover: {
    borderRadius: 0,
    height: 300,
  },
  fabLabelStyle: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  date: {
    display: "flex",
    backgroundColor: "#0298d3",
    color: "#ffffff",
    padding: 10,
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
  Cover: {
    width: "100%",
    height: 100,
    padding: 0,
    borderRadius: 0,
    backgroundColor: "#007096",
  },
  cardText: {
    textAlign: "center",
    paddingTop: 10,
    fontSize: 16,
  },
});
export default PropertyDetails;
