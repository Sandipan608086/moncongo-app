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
import AppbarHeader from "../../component/Appbar";
// import CameraApp from "../../component/CameraApp";
import { useIsFocused } from "@react-navigation/native";
import ImagePickerLoad from "../../component/ImagePicker";
import { useSelector, useDispatch } from "react-redux";
import { autoListApi, autoImgApi } from "./../../store/UserSlices";
import { autoDetailImgApi } from "../../store/AutoSlices";
const ImageAutoScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const g = require("./../../Navigation/Style");
  const routeData = JSON.parse(route.params);
  const AUTODETAILDATA = useSelector((state) => state.auto.autoDetailImg);
  const [imgType, setImgType] = useState();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [listImage, setListImage] = useState();
  const [gal, setGat] = useState(0);
  const [list, setList] = useState("");
  const autoImg = () => {
    dispatch(autoDetailImgApi({ slug: routeData.slug })).then((req) => {
      setList(req.payload.data.list_image);
      setGat(req.payload.data.flier_image.length);
    })
  }
  useEffect(() => {
    if(isFocused === true){
      autoImg()
    }
    return () => {};
  }, [isFocused]);
  return (
    <SafeAreaView style={g.Container}>
      <AppbarHeader
        title="Vehicle Images"
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
            Image in list and gallery is required
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
            List image
          </Text>
          {AUTODETAILDATA.list_image !== "" ? (
            <Card
              mode="elevated"
              style={{ backgroundColor: "#fff", marginBottom: 20 }}
            >
              <Card.Cover
                source={{ uri: AUTODETAILDATA.list_image }}
                style={{ width: "100%", height: 300 }}
              />
              <FAB
                icon="delete-outline"
                style={styles.fabDelete}
                size={"small"}
                onPress={() => {
                  dispatch(
                    autoListApi({
                      type: "autoDelete",
                      id: AUTODETAILDATA.list_image_id,
                    })
                  ).then((res) => {
                    if (res.payload.status === true) {
                      Alert.alert(res.payload.message);
                      // navigation.navigate("ListAuto");
                      autoImg()
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
            <ImagePickerLoad
              imgApi={autoImgApi}
              imgType={"list_image"}
              id={AUTODETAILDATA.car_id}
              navigation={navigation}
              callBack={autoImg}
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
            Gallery image
          </Text>
          {AUTODETAILDATA.flierImage &&
            AUTODETAILDATA.flierImage.map((value, i) => {
              return (
                <Card
                  key={i}
                  mode="elevated"
                  style={{ backgroundColor: "#fff", marginBottom: 20 }}
                >
                  <Card.Cover
                    source={{ uri: value.car_img_url }}
                    style={{ width: "100%" }}
                  />
                  <FAB
                    icon="delete-outline"
                    style={styles.fabDelete}
                    size={"small"}
                    onPress={() => {
                      dispatch(
                        autoListApi({
                          type: "autoDelete",
                          id: value.car_img_id,
                        })
                      ).then((res) => {
                        if (res.payload.status === true) {
                          Alert.alert(res.payload.message);
                          // navigation.navigate("ListAuto");
                          autoImg()
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
          <ImagePickerLoad
            imgApi={autoImgApi}
            imgType={"flier_image"}
            id={AUTODETAILDATA.car_id}
            navigation={navigation}
            navigate={"imageAuto"}
            nData={routeData}
            callBack={autoImg}
            w={4}
            h={3}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
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
export default ImageAutoScreen;
