import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Appbar,
  Surface,
  Text,
  Button,
  TextInput,
  List,
  HelperText,
  Card,
  FAB,
} from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import AppbarHeader from "../../component/Appbar";
// import CameraApp from "../../component/CameraApp";
import ImagePickerLoad from "../../component/ImagePicker";
import { useSelector, useDispatch } from "react-redux";
import { propertyListApi, propertyImgApi } from "./../../store/UserSlices";
import { propertyDetailImgApi } from "../../store/PropertySlices";

const ImagePropertyScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const g = require("./../../Navigation/Style");
  const routeData = JSON.parse(route.params);
  const PROPERTYDATA = useSelector((state) => state.property.propertyDetailImg);
  const [imgType, setImgType] = useState();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [listImage, setListImage] = useState();
  const [gal, setGat] = useState(0);
  const [list, setList] = useState(0);
  const propertyImg = () => {
    dispatch(propertyDetailImgApi({ slug: routeData.slug })).then((req) => {
      setList(req.payload.data.list_image);
      setGat(req.payload.data.flier_image.length);
    })
  }
  useEffect(() => {
    if(isFocused === true){
      propertyImg()
    }
  }, [isFocused]);
  return (
    // cameraVisible ? <CameraApp photo={listImage} setPhoto={setListImage} setCameraVisible={setCameraVisible} imgType={imgType} imgApi={propertyImgApi} id={PROPERTYDATA.property_id} navigation={navigation} navigate={'ListProperty'} />
    //     :
    <SafeAreaView style={g.Container}>
      <AppbarHeader
        title="Immobilier Image"
        back={true}
        home={false}
        navigation={navigation}
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
      >
        {gal > 0 && list != "" ? (
          <Text></Text>
        ) : (
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins_700Bold",
              margin: 10,
              padding: 10,
              backgroundColor: "red",
              color: "#fff",
            }}
          >
            l'image dans la liste et la galerie est requise
          </Text>
        )}
        <View style={{ flex: 1, padding: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins_700Bold",
              marginBottom: 10,
            }}
          >
            liste Image
          </Text>
          {PROPERTYDATA.list_image !== "" ? (
            <Card
              mode="elevated"
              style={{ backgroundColor: "#fff", marginBottom: 20 }}
            >
              <Card.Cover
                source={{ uri: PROPERTYDATA.list_image }}
                style={{ width: "100%", height: 300 }}
              />
              <FAB
                icon="delete-outline"
                style={styles.fabDelete}
                size={"small"}
                onPress={() => {
                  dispatch(
                    propertyListApi({
                      type: "propertyDelete",
                      id: PROPERTYDATA.list_image_id,
                    })
                  ).then((res) => {
                    if (res.payload.status === true) {
                      Alert.alert(res.payload.message);
                      // navigation.navigate("ListProperty");
                      propertyImg()
                    } else {
                      Alert.alert(res.payload.message);
                    }
                  });
                }}
              />
            </Card>
          ) : (
            // <Button
            //     mode="contained-tonal"
            //     icon="camera"
            //     onPress={() => { setCameraVisible(true), setListImage(undefined), setImgType('list_image') }}
            // >Camera</Button>
            <Image alt="image"PickerLoad
              imgApi={propertyImgApi}
              imgType={"list_image"}
              id={PROPERTYDATA.property_id}
              navigation={navigation}
              callBack={propertyImg}
              w={4}
              h={4}
            />
          )}
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins_700Bold",
              marginBottom: 10,
            }}
          >
            Image du dépliant
          </Text>
          {PROPERTYDATA.flierImage &&
            PROPERTYDATA.flierImage.map((value, i) => {
              return (
                <Card
                  key={i}
                  mode="elevated"
                  style={{ backgroundColor: "#fff", marginBottom: 20 }}
                >
                  <Card.Cover
                    source={{ uri: value.property_img_url }}
                    style={{ width: "100%" }}
                  />
                  <FAB
                    icon="delete-outline"
                    style={styles.fabDelete}
                    size={"small"}
                    onPress={() => {
                      dispatch(
                        propertyListApi({
                          type: "propertyDelete",
                          id: value.property_img_id,
                        })
                      ).then((res) => {
                        if (res.payload.status === true) {
                          Alert.alert(res.payload.message);
                          // navigation.navigate("ListProperty");
                          propertyImg()
                        } else {
                          Alert.alert(res.payload.message);
                        }
                      });
                    }}
                  />
                </Card>
              );
            })}
          {/* <Button
              mode="contained-tonal"
              icon="camera"
              onPress={() => { setCameraVisible(true), setListImage(undefined), setImgType('flier_image') }}
          >Camera</Button> */}
          <Image alt="image"PickerLoad
            imgApi={propertyImgApi}
            imgType={"flier_image"}
            id={PROPERTYDATA.property_id}
            navigation={navigation}
            callBack={propertyImg}
            w={4}
            h={3}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImagePropertyScreen;

const styles = StyleSheet.create({
  fabDelete: {
    position: "absolute",
    margin: 16,
    right: -25,
    top: -25,
    alignItems: "flex-end",
    backgroundColor: "#ffcccb",
  },
});
