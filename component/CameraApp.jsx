import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, MD2Colors, Button } from "react-native-paper";
import { Camera } from "expo-camera";
// [
//   "expo-camera",
//   {
//     "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
//   }
// ],
// import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from "expo-media-library";
import { useSelector, useDispatch } from "react-redux";
// import { autoImgApi } from "../store/UserSlices";
export default function CameraApp(props) {
  const g = require("../Navigation/Style");
  const dispatch = useDispatch();
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isloading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 0.5,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    props.setPhoto(newPhoto);
  };

  if (props.photo) {
    // let sharePic = () => {
    //   shareAsync(photo.uri).then(() => {
    //     setPhoto(undefined);
    //   });
    // };

    let savePhoto = () => {
      setLoading(true);
      MediaLibrary.saveToLibraryAsync(props.photo.uri).then(() => {
        dispatch(
          props.imgApi({
            img: "data:image/png;base64," + props.photo.base64,
            type: props.imgType,
            id: props.id,
          })
        ).then((req) => {
          props.setPhoto(undefined);
          props.setCameraVisible(false);
          props.navigation.navigate(props.navigate);
          setLoading(false);
        });
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          animating={isloading}
          color={MD2Colors.blue200}
          size="large"
        />
        <Image alt="image"
          style={styles.preview}
          source={{ uri: "data:image/png;base64," + props.photo.base64 }}
        />
        <View style={{ flexDirection: "row" }}>
          <View style={{ padding: 5 }}>
            <Button
              onPress={() => props.setPhoto(undefined)}
              style={{ margin: 0, borderRadius: 0}} 
              buttonColor={'#ffffff'}
              textColor={'#000000'}
            >
              Jeter
            </Button>
          </View>
          <View style={{ padding: 5 }}>
            {hasMediaLibraryPermission ? (
              <Button
                onPress={savePhoto}
                style={{ margin: 0, borderRadius: 0}} 
              buttonColor={'#ffffff'}
              textColor={'#000000'}
              >
                Ajouter
                </Button>
            ) : undefined}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button style={{paddingTop: 10, paddingBottom: 10, margin: 0, borderRadius: 0}} buttonColor={'#0298d3'} textColor={'#ffffff'} onPress={takePic}>Prendre une photo</Button>
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "90%",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
