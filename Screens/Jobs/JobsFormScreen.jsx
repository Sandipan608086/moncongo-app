import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, TextInput, Text } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { jobsForm } from "../../store/JobsSlices";
const JobsForm = ({ navigation, route }) => {
  const g = require("./../../Navigation/Style");
  const dispatch = useDispatch();
  const [isloading, setLoading] = useState(false);
  const routeId = JSON.parse(route.params);
  const JOBFORM = useSelector((state) => state.job.form);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [textarea, setTextarea] = useState("");
  const [filetype, setFiletype] = useState("");
  const [votrecv, setVotrecv] = useState("");
  const [namecv, setNamecv] = useState("");
  const [emailValidate, setEmailValidate] = useState(false)
  const formData = () => {
    setLoading(true);
    if (routeId !== "") {
      if (name !== "" && email !== "" && votrecv !== "") {
        dispatch(
          jobsForm({
            id: routeId.id,
            name: name,
            email: email,
            textarea: textarea,
            votrecv: votrecv,
            mimeType: filetype,
            type: 'mobile'
          })
        ).then((res) => {
          if (res.payload.status == true) {
            setName("");
            setEmail("");
            setTextarea("");
            setVotrecv("");
            setNamecv("");
            setFiletype("")
            Alert.alert(res.payload.message);
            setLoading(false);
          } else {
            Alert.alert(res.payload.message);
            setLoading(false);
          }
        })
        
      } else {
        Alert.alert("Tous les champs sont requis!");
        setLoading(false);
      }
    } else {
      Alert.alert("Id empty!");
      setLoading(false);
    }
  };
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({type: ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]});
    let base64Img = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log(result);
    setFiletype(result.assets[0].mimeType)
    // setVotrecv(`data:application/pdf;base64,${base64Img}`);
    setVotrecv(base64Img);
    setNamecv(result.assets[0].name);
  };
  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      // Alert.alert("Email is Not Correct")
      setEmail(text)
      setEmailValidate(true)
    } else {
      setEmail(text)
      setEmailValidate(false)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Appliquer"
        back={true}
        home={true}
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Nom *"
            value={name}
            onChangeText={(name) => setName(name)}
            style={{ marginTop: 10, backgroundColor: "#ffffff" }}
            activeOutlineColor={"#0298d3"}
          />
          <TextInput
            mode="outlined"
            label="Email *"
            value={email}
            onChangeText={(email) => this.validate(email)}
            style={{ marginTop: 10, backgroundColor: "#ffffff" }}
            activeOutlineColor={"#0298d3"}
            inputMode="email"
          />
          {emailValidate === true && <Text style={{color: 'red'}}>Entrez un identifiant de messagerie valide</Text>}
          <TextInput
            mode="outlined"
            style={{
              marginTop: 10,
              backgroundColor: "#ffffff",
              justifyContent: "flex-start",
            }}
            activeOutlineColor={"#0298d3"}
            underlineColorAndroid="transparent"
            label="Lettre de motivation"
            numberOfLines={8}
            multiline={true}
            value={textarea}
            onChangeText={(textarea) => setTextarea(textarea)}
          />
          <Button
            style={{ marginTop: 20 }}
            mode="outlined"
            onPress={() => pickDocument()}
          >
            {" "}
            {namecv ? namecv : "Télécharger CV *"}{" "}
          </Button>
          <Text style={{padding: 5}}>Télécharger les fichiers en format PDF et DOC seulement</Text>
          <Button
            mode="contained"
            onPress={() => formData()}
            disabled={isloading}
            loading={isloading}
            style={g.Btn}
          >
            Postulez
          </Button>
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
  form: {
    padding: 15,
  },
});
export default JobsForm;
