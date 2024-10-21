import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  ScrollView,
  Image,
  Platform
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  MD2Colors,
  FAB,
  Text,
  Button,
  RadioButton,
  Appbar,
} from "react-native-paper";
import MenuDrawer from "react-native-side-drawer";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { tendersApi, tendersCategory } from "../../store/TendersSlices";
import CardComponent from "../../component/CardComponent";
const TendersScreen = ({ navigation, threshold = 100 }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [category, setCategoryPage] = useState(0);
  const [type, setTypePage] = useState("allTenders");
  const [value, setValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const TENDERSLIST = useSelector((state) => state.tender.tenders);
  const CATEGORYLIST = useSelector((state) => state.tender.category);
  const LODING = useSelector((state) => state.tender.loading);

  const [isVisible, setIsVisible] = useState(false);
  const flatListRef = useRef(null);
  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    setIsVisible(contentOffset.y > threshold);
  };
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      setIsVisible(false); // Hide button after scrolling to top
    }
  };

  useEffect(() => {
    dispatch(
      tendersApi({
        page: currantPage,
        categoryId: category,
        type: type,
      })
    );
    dispatch(tendersCategory());
    setRefreshing(false);
  }, [currantPage, refreshing, category, type]);
  const filter = () => {
    if (value != "") {
      setCurrantPage(1);
      setCategoryPage(value);
      setTypePage("searchTenders");
      setToggleOpen(false);
    } else {
      Alert.alert("Champ de filtre Vide");
    }
    // setModalVisible(!modalVisible)
  };
  onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardComponent
        item={item}
        navigation={navigation}
        button={true}
        details={"TenderDetails"}
      />
    </View>
  );
  const renderLoderFooter = () => {
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
  noItemDisplay = () => {
    return (
      !TENDERSLIST && (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image
            style={{ width: 500, height: 500 }}
            source={require("../../assets/noData.png")}
          />
        </View>
      )
    );
  };
  const toggleOpenFuc = (e) => {
    setToggleOpen(e);
  };
  const clearForm = () => {
    setValue("");
  };
  drawerContent = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "rgba(248, 248, 248, 1)" }} elevation={6}>
        <Appbar.Header statusBarHeight={Platform.OS === "ios" ? 80 : 0}>
          <Appbar.Content title="D’offres Filtre" titleStyle={{ fontSize: 18, fontFamily: "Poppins_700Bold" }} />
          <Appbar.Action icon="close" onPress={() => toggleOpenFuc(false)} />
        </Appbar.Header>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setValue(value == newValue ? '' : newValue);
              }}
              value={value}
            >
              {CATEGORYLIST.map((data, i) => {
                return (
                  // <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  //     <RadioButton value={data.tenders_category_id} />
                  //     <Text>{data.tenders_category_title}</Text>
                  // </View>
                  <View key={i} style={{ flexDirection: "row" }}>
                    <RadioButton.Item
                      value={data.tenders_category_id}
                      label={data.tenders_category_title}
                      labelStyle={{ width: "90%", fontSize: 15 }}
                      color={"#0298d3"}
                    />
                  </View>
                );
              })}
            </RadioButton.Group>
          </View>
        </ScrollView>
        <View
          style={{
            padding: 10,
            backgroundColor: "#ffffff",
            flexDirection: "row"
          }}
        >
          <Button
            style={[g.Btn, { marginRight: 10, width: "49%" }]}
            mode="contained"
            onPress={() => filter()}
          >
            Filtre
          </Button>
          <Button
            style={[
                g.Btn,
                {
                  fontFamily: "Poppins_400Regular",
                  backgroundColor: "red",
                  width: "49%",
                },
              ]}
            mode="contained"
            onPress={() => clearForm()}
          >
            Claire
          </Button>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
        <AppbarHeader
          title="Appels d’offres"
          back={true}
          home={true}
          navigation={navigation}
        />
        <View
        style={{
          marginTop: 0,
          flex: 1,
          justifyContent: "flex-end"
        }}
      >
      <MenuDrawer
        open={toggleOpen}
        position={"right"}
        drawerContent={this.drawerContent()}
        drawerPercentage={80}
        animationTime={250}
        overlay={true}
        opacity={1}
      >
        
        <FlatList
          ref={flatListRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          onEndReachedThreshold={0}
          onEndReached={this.onEndReachedHandler}
          onMomentumScrollBegin={() => {
            onEndReachedCalledDuringMomentum.current = false;
          }}
          ListFooterComponent={renderLoderFooter}
          data={TENDERSLIST}
          renderItem={this._renderItem}
          ListEmptyComponent={this.noItemDisplay}
          keyExtractor={(item) => item.id}
          numColumns={1}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setCurrantPage(1);
            setCategoryPage(0);
            setTypePage("allTenders");
            setValue("");
          }}
        />
        {/*{isVisible && <FAB
                    icon="arrow-up"
                    style={styles.fab2}
                    onPress={scrollToTop}
                    color="#ffffff"
                />}*/}
        <FAB
          icon="filter"
          style={styles.fab}
          color="#ffffff"
          onPress={() => toggleOpenFuc(true)}
        />
      </MenuDrawer>
      </View>
      
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
  fab2: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 70,
    backgroundColor: "#0298d3",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    // borderRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    // alignItems: 'center',
    shadowColor: "#000",
    width: "60%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
export default TendersScreen;
