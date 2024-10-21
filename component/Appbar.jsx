import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, Alert, Image } from "react-native";
import { Appbar, Avatar, Button, Card } from "react-native-paper";

const AppbarHeader = (props) => {
  const headerProps = {};
  if (Platform.OS === "ios") {
    headerProps.statusBarHeight = 0;
  }

  return (
    <Appbar.Header
      mode="center-aligned"
      style={styles.header}
      elevation={2}
      {...headerProps}
    >
      {props.back == true ? (
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
      ) : (
        ""
      )}
      {props.logo == true && (
        <Appbar.Action
          icon={({ size }) => (
            <Image
              source={require("./../assets/logo-top.png")}
              style={{ width: size, height: size }}
            />
          )}
          size={50}
          animated={false}
        />
      )}
      <Appbar.Content
        category="h1"
        title={props.title}
        titleStyle={{ fontSize: 16, fontFamily: "Poppins_700Bold" }}
      />
      {props.logo == true && (
        <Appbar.Action
          icon={({ size }) => (
            <Image
              source={require("./../assets/logo-top-w.png")}
              style={{ width: size, height: size }}
            />
          )}
          size={50}
        />
      )}
      {props.home == true ? (
        <Appbar.Action
          icon="home-outline"
          onPress={() => props.navigation.navigate("Accueil", "Dashboard")}
        />
      ) : (
        ""
      )}
    </Appbar.Header>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
  },
});
export default AppbarHeader;
