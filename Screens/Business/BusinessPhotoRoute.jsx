import React, { useEffect, useState, useRef } from "react";
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
  Platform
} from "react-native";
import { Appbar, Avatar, Button, Card, Surface, Modal, IconButton } from "react-native-paper";
import { useSelector } from "react-redux";

const BusinessPhotoRoute = (props) => {
  const BUSINESSHOME = useSelector(
    (state) => state.businessDetails.businesshome
  );
  const [visible, setVisible] = useState(false);
  const containerStyle = { height: '100%', position: 'absolute', top: -30, zIndex: 555555555, width: '100%' };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [imgShow, setImgshow] = useState("")
  const openImg = (e) => {
    setVisible(true)
    setImgshow(e)
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollView}>
        <View style={{ flex: 1, marginBottom: 0 }}>
          {BUSINESSHOME.gallery ? (
            BUSINESSHOME.gallery.map((value, i) => {
              return (
                <Card
                  key={i}
                  mode="elevated"
                  style={{ backgroundColor: "#fff", marginBottom: 10 }}
                  onPress={() => openImg(value)}
                >
                  <Card.Cover source={{ uri: value }} style={styles.Cover} />
                </Card>
              );
            })
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Image
                style={{ width: 500, height: 500 }}
                source={require("./../../assets/noData.png")}                
              />
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <View style={{ flexDirection: 'row', position: 'absolute', top: 0, right: 20, zIndex: 999999 }}>
          <IconButton style={{ backgroundColor: 'white' }} icon="close-circle" size={30} iconColor="#0287BC" onPress={() => setVisible(false)} />
        </View>
        <Image
          style={styles.image}
          source={{ uri: imgShow }}
        />
      </Modal>
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
    padding: 10,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  Cover: {
    width: "100%",
    // height: 169,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
  },
});
export default BusinessPhotoRoute;
