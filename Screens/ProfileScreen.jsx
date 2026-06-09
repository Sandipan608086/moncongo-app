import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Appbar, Card, Avatar, List, Icon } from "react-native-paper";
import AppbarHeader from "../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import {
  userGetKey,
  userRemoveKey,
  profileShowApi,
} from "./../store/UserSlices";
import { useIsFocused } from "@react-navigation/native";
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userKey = useSelector((state) => state.user.userKey);
  // const PROFILE = useSelector(state => state.user.profile);
  const [PROFILE, setPROFILE] = useState("");
  function profileShow() {
    dispatch(userGetKey()).then((req) => {
      dispatch(profileShowApi(JSON.parse(req.payload))).then((req) => {
        setPROFILE(req.payload);
      });
    });
  }
  useEffect(() => {
    // (async function () {
    //     try {
    //         profileShow()
    //     } catch (e) {
    //         console.log(e)
    //     }
    // })();
    if (isFocused === true) {
      profileShow();
    }
  }, [isFocused]);
  function logout() {
    if (userKey) {
      dispatch(userRemoveKey()).then(() => {
        Alert.alert("Déconnexion réussie");
        navigation.navigate("Login");
      });
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Profil"
        back={false}
        home={false}
        logo={true}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        style={styles.view}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.profileView}>
          <Avatar.Text
            elevation={4}
            size={100}
            label={PROFILE?.name ? PROFILE.name.slice(0, 2) : "??"}
            labelStyle={{ textTransform: "uppercase", marginTop: 5 }}
            style={{ backgroundColor: "#0298d3" }}
          />
          <View style={{ paddingHorizontal: 30, marginBottom: 20 }}>
            {PROFILE.customer_name && (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontSize: 24,
                  fontFamily: "Poppins_700Bold",
                }}
              >
                {PROFILE.customer_name}
              </Text>
            )}
            {PROFILE.address && (
              <Text style={styles.profileText}>{PROFILE.address}</Text>
            )}
            {PROFILE.phone && (
              <Text style={styles.profileText}>+{PROFILE.phone}</Text>
            )}
            {PROFILE.customer_email && (
              <Text style={styles.profileText}>{PROFILE.customer_email}</Text>
            )}
            {PROFILE.customer_company && (
              <Text style={styles.profileText}>{PROFILE.customer_company}</Text>
            )}
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <List.Section>
            <List.Item
              style={styles.profileList}
              titleStyle={{ color: "#ffffff" }}
              title="Editer le profil"
              onPress={() =>
                navigation.navigate("AddProfile", JSON.stringify(PROFILE))
              }
              right={() => (
                <List.Icon color={"#ffffff"} icon="arrow-right-thin" />
              )}
            />
            <List.Item
              style={styles.profileList}
              titleStyle={{ color: "#ffffff" }}
              title="Liste Auto"
              onPress={() => navigation.navigate("ListAuto")}
              right={() => (
                <List.Icon color={"#ffffff"} icon="arrow-right-thin" />
              )}
            />
            <List.Item
              style={styles.profileList}
              titleStyle={{ color: "#ffffff" }}
              title="Liste Immobilier"
              onPress={() => navigation.navigate("ListProperty")}
              right={() => (
                <List.Icon color={"#ffffff"} icon="arrow-right-thin" />
              )}
            />
            <List.Item
              style={styles.profileList}
              titleStyle={{ color: "#ffffff" }}
              title="Changer mon mot de passe"
              onPress={() =>
                navigation.navigate(
                  "ChangeMyPassword",
                  JSON.stringify({ email: PROFILE.customer_email })
                )
              }
              right={() => (
                <List.Icon color={"#ffffff"} icon="arrow-right-thin" />
              )}
            />
            <List.Item
              style={styles.profileList}
              titleStyle={{ color: "#ffffff" }}
              title="Se déconnecter"
              onPress={() => logout()}
              right={() => (
                <List.Icon color={"#ffffff"} icon="arrow-right-thin" />
              )}
            />
          </List.Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  view: {
    flex: 1,
    padding: 15,
  },
  header: {
    backgroundColor: "#ffffff",
  },
  profileView: {
    alignItems: "center",
    width: "100%",
  },
  profileList: {
    backgroundColor: "#0298d3",
    marginBottom: 5,
  },
  profileText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
