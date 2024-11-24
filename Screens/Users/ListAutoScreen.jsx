import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Appbar,
  ActivityIndicator,
  MD2Colors,
  FAB,
  Modal,
  Text,
  TextInput,
  Button,
  Checkbox,
  Badge,
} from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import {
  autoListApi,
  countriesApi,
  cityApi,
  countriesCodeApi,
  modelApi,
} from "../../store/UserSlices";
import CardAutoImmobilier from "./../../component/CardAutoImmobilier";

const ListAutoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [isAutoCount, setIsAutoCount] = useState();
  const LODING = useSelector((state) => state.user.loading);
  const userKey = useSelector((state) => state.user.userKey);
  const AUTOLIST = useSelector((state) => state.user.autoList);
  const autoList = () => {
    dispatch(autoListApi({ key: JSON.parse(userKey), type: "autoList" })).then(
      (req) => {
        setIsAutoCount(req.payload.data);
        dispatch(countriesApi());
        dispatch(cityApi());
        dispatch(countriesCodeApi());
        dispatch(modelApi({ type: "cars_type" }));
        setRefreshing(false);
      }
    );
  };
  useEffect(() => {
    const autoListFocus = navigation.addListener("focus", () => {
      autoList();
    });
    return () => {
      autoListFocus();
      setRefreshing(false);
    };
  }, [currantPage, refreshing, userKey, AUTOLIST]);
  onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardAutoImmobilier
        item={item}
        navigation={navigation}
        brand={true}
        payment={false}
        other={false}
        footerText={true}
        details={"AutosDetails"}
      />
      <FAB
        icon="square-edit-outline"
        style={styles.fabEdit}
        size={"small"}
        color={"#ffffff"}
        onPress={() => {
          dispatch(autoListApi({ type: "autoShow", slug: item.slug })).then(
            (message) => {
              navigation.navigate(
                "AddAuto",
                JSON.stringify({ type: "editAuto", data: message.payload })
              );
            }
          );
        }}
      />
      {item.gal > 0 && item.list > 0 ? (
        <FAB
          icon="image"
          style={styles.fabImg}
          size={"small"}
          color={"#ffffff"}
          onPress={() => {
            dispatch(autoListApi({ type: "autoShow", slug: item.slug })).then(
              () => {
                navigation.navigate(
                  "ImageAuto",
                  JSON.stringify({ type: "imageAuto", slug: item.slug, list: item.list, gal: item.gal })
                );
              }
            );
          }}
        />
      ) : (
        <FAB
          icon="image-off"
          style={[styles.fabImg, { backgroundColor: "red" }]}
          size={"small"}
          color={"#ffffff"}
          onPress={() => {
            dispatch(autoListApi({ type: "autoShow", slug: item.slug })).then(
              () => {
                navigation.navigate(
                  "ImageAuto",
                  JSON.stringify({ type: "imageAuto", slug: item.slug, list: item.list, gal: item.gal })
                );
              }
            );
          }}
        />
      )}
      {item.is_sold == "0" ? (
        <FAB
          icon="car-back"
          style={[styles.fabMarque, { backgroundColor: "red" }]}
          size={"small"}
          color={"#ffffff"}
          onPress={() => {
            Alert.alert(
              "",
              "Souhaitez-vous marquer cette voiture comme vendue ?",
              [
                {
                  text: "Cancel",
                  // onPress: () => console.log('Cancel Pressed'),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    dispatch(
                      autoListApi({ id: item.id, type: "autoSold" })
                    ).then((req) => {
                      if (req.payload.status) {
                        Alert.alert(req.payload.message);
                        autoList();
                      }
                    });
                  },
                },
              ]
            );
          }}
        />
      ) : (
        <FAB
          icon="car"
          style={[styles.fabMarque, { backgroundColor: "green" }]}
          size={"small"}
          color={"#ffffff"}
          onPress={() => {
            Alert.alert(
              "",
              "Souhaitez-vous marquer cette voiture comme non vendue ?",
              [
                {
                  text: "Cancel",
                  // onPress: () => console.log('Cancel Pressed'),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    dispatch(
                      autoListApi({ id: item.id, type: "autoUnSold" })
                    ).then((req) => {
                      if (req.payload.status) {
                        Alert.alert(req.payload.message);
                        autoList();
                      }
                    });
                  },
                },
              ]
            );
          }}
        />
      )}
    </View>
  );
  const renderLoder = () => {
    return (
      LODING && (
        <View>
          <ActivityIndicator
            animating={true}
            color={MD2Colors.blue100}
            size={40}
            style={{ marginTop: 30 }}
          />
        </View>
      )
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Liste Auto"
        back={true}
        home={false}
        navigation={navigation}
      />
      {isAutoCount !== null ? (
        <FlatList
          showsVerticalScrollIndicator={true}
          onEndReachedThreshold={0}
          onEndReached={this.onEndReachedHandler}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListFooterComponent={renderLoder}
          data={AUTOLIST.data}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 50,
          }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setCurrantPage(1);
          }}
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image alt="image"
            style={{ width: 500, height: 500 }}
            source={require("./../../assets/noData.png")}
          />
        </View>
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#ffffff"
        onPress={() =>
          navigation.navigate("AddAuto", JSON.stringify({ type: "addAuto" }))
        }
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    alignItems: "flex-end",
    backgroundColor: "#0298d3",
  },
  fabEdit: {
    position: "absolute",
    margin: 16,
    right: -25,
    top: -25,
    alignItems: "flex-end",
    backgroundColor: "#0298d3",
  },
  fabImg: {
    position: "absolute",
    margin: 16,
    right: -25,
    top: 25,
    alignItems: "flex-end",
    backgroundColor: "#0298d3",
  },
  fabMarque: {
    position: "absolute",
    margin: 16,
    right: -25,
    top: 75,
    alignItems: "flex-end",
    backgroundColor: "#0298d3",
  },
  centeredView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    shadowColor: "#000",
    width: "100%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdown: {
    marginBottom: 20,
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default ListAutoScreen;
