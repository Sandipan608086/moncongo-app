import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Platform
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Appbar,
  Avatar,
  Button,
  RadioButton,
  Card,
  Surface,
  ActivityIndicator,
  MD2Colors,
  FAB,
} from "react-native-paper";
import MenuDrawer from "react-native-side-drawer";
import BusinessListCom from "../../component/BusinessListCom";
import AppbarHeader from "../../component/Appbar";
import { businessListApi } from "../../store/business/BusinessListSlices";
import { useSelector, useDispatch } from "react-redux";

const BusinessListScreen = ({ navigation, route, threshold = 100 }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [loadList, setLoadList] = useState(false);
  const BUSINESSLIST = useSelector(
    (state) => state.businesslistdata.businesslist
  );
  const CITYLIST = useSelector(
    (state) => state.businesslistdata.cityfilters
  );
  const LODING = useSelector((state) => state.businesslistdata.loading);
  const routeData = JSON.parse(route.params);

  const [toggleOpen, setToggleOpen] = useState(false);
  const [value, setValue] = useState("");

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
  const filter = () => {
    setLoadList(true)
    dispatch(
      businessListApi({
        page: 1,
        cId: routeData.directory_category_id,
        sId: routeData.directory_subcategory_id,
        cityId: value
      })
    ).then(() => {
      toggleOpenFuc(false)
      setLoadList(false)
    })
  }
  useEffect(() => {
    dispatch(
      businessListApi({
        page: currantPage,
        cId: routeData.directory_category_id,
        sId: routeData.directory_subcategory_id,
        cityId: value
      })
    )
  }, [currantPage]);

  onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      setLoadList(true);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <BusinessListCom data={item} navigation={navigation} />
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
  const toggleOpenFuc = (e) => {
    setToggleOpen(e);
  };
  drawerContent = () => {
    return (
      <View
        style={{ flex: 1, backgroundColor: "rgba(248, 248, 248, 1)" }}
        elevation={6}
      >
        <Appbar.Header statusBarHeight={Platform.OS === "ios" ? 80 : 0}>
          <Appbar.Content
            title="Ville"
            titleStyle={{ fontSize: 18, fontFamily: "Poppins_700Bold" }}
          />
          <Appbar.Action icon="close" onPress={() => toggleOpenFuc(false)} />
        </Appbar.Header>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
        >
          <View>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setValue(value == newValue ? "" : newValue);
              }}
              value={value}
            >
              {CITYLIST.map((data, i) => {
                return (
                  <View key={i} style={{ flexDirection: "row" }}>
                    <RadioButton.Item
                      value={data.id}
                      label={data.name}
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
            flexDirection: "row",
          }}
        >
          <Button
            style={[g.Btn, { marginRight: 10, width: "100%" }]}
            mode="contained"
            onPress={() => filter()}
            disabled={loadList}
            loading={loadList}
          >
            Rechercher
          </Button>
          {/* <Button
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
          </Button> */}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={stylesList.container}>
      <AppbarHeader
        title={routeData.directory_subcategory_title}
        back={true}
        home={true}
        navigation={navigation}
      />
      <View
        style={{
          marginTop: 0,
          flex: 1,
          justifyContent: "flex-end",
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
          ListFooterComponent={renderLoder}
          data={BUSINESSLIST}
          renderItem={this._renderItem}
          keyExtractor={(item) => item.directory_id}
          numColumns={1}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
        />
        <FAB
          color="#ffffff"
          icon="filter"
          style={stylesList.fab}
          onPress={() => toggleOpenFuc(true)}
        />
      </MenuDrawer>
      </View>
    </SafeAreaView>
  );
};
const stylesList = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#0298d3",
  },
});

export default BusinessListScreen;
