import { useState, useEffect } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Button, ActivityIndicator, MD2Colors } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";

export default function ImagePickerLoad(props) {
  const g = require("./../Navigation/Style");
  const dispatch = useDispatch();
  // const [uploading, setUploading] = useState(false);
  // const [image, setImage] = useState('');
  const [isloading, setLoading] = useState(false);
  // Select image from library or camera
  const selectImage = async (useLibrary) => {
    let result;
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [props.w, props.h],
      quality: 1,
      base64: true
    }

    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    }

    // Save image if not cancelled
    if (!result.canceled) {
      setLoading(true);
      // setImage(result.assets[0].uri);
      dispatch(
        props.imgApi({
          img: "data:image/png;base64," + result.assets[0].base64,
          type: props.imgType,
          id: props.id,
        })
      ).then((req) => {
        props.callBack();
        setLoading(false);
      });
    }
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating={isloading}
        color={MD2Colors.blue200}
        size="large"
        style={{ marginTop: 30 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 20,
        }}
      >

        <Button style={[g.Btn, { marginRight: 10 }]} textColor={'#ffffff'} onPress={() => selectImage(true)}>Parcourir l'image</Button>
        <Button style={g.Btn} textColor={'#ffffff'} onPress={() => selectImage(false)}>Cliquez sur l'image</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});
