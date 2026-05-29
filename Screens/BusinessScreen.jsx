import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Surface,
  ActivityIndicator,
  MD2Colors,
  Badge,
  FAB,
} from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { businessCategoryApi } from "../store/business/BusinessCategorySlices";
import AppbarHeader from "../component/Appbar";

const BusinessScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const CATEGORY = useSelector((state) => state.business.category);
  const LODING = useSelector((state) => state.business.loading);

  const { width, height } = Dimensions.get("window");
  const ratio = 100 / 100;

  const getApiData = () => {
    dispatch(businessCategoryApi({ page: currantPage }));
  };
  useEffect(() => {
    getApiData();
    // return () => {}
  }, [currantPage]);

  const onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
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
  const _renderItem = ({ item }) => (
    <View style={{ flex: 0.5, margin: 10, width: "100%" }}>
      <Pressable
        style={styles.card}
        onPress={() => {
          item.category_count > 0 &&
            navigation.navigate("SubCategory", JSON.stringify(item));
        }}
      >
        {/* {item.category_count > 0 && <Badge style={{ position: 'absolute', top: -4, right: -4, zIndex: 5 }}>{item.category_count}</Badge>} */}
        <Card
          style={{ borderRadius: 0, backgroundColor: "rgba(0,0,0,0)" }}
          elevation={0}
        >
          <Card.Cover
            source={
              item.directory_category_icon !== null
                ? { uri: item.directory_category_icon }
                : require("../assets/noImage.png")
            }
            style={[
              styles.Cover,
              { aspectRatio: 300 / 300, height: undefined, width: "100%" },
            ]}
          />
          {/* <Image alt="image"Background
            source={
              item.directory_category_icon
                ? { uri: item.directory_category_icon }
                : require("../assets/noImage.png")
            }
            // blurRadius={10}
            resizeMode={`contain`}
            style={styles.Cover}
          /> */}
          {/* <Card.Content> */}
          <Text style={styles.cardText}>{item.directory_category_title}</Text>
          {/* </Card.Content> */}
        </Card>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Répértoire"
        back={true}
        home={true}
        navigation={navigation}
      />
      <FlatList
        showsVerticalScrollIndicator={true}
        onEndReachedThreshold={0}
        onEndReached={onEndReachedHandler}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        ListFooterComponent={renderLoder}
        data={CATEGORY}
        renderItem={_renderItem}
        keyExtractor={(item) => item.directory_category_id}
        numColumns={2}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  card: {
    backgroundColor: "rgba(248, 248, 248, 1)",
    padding: 0,
    // height: 176
  },
  Cover: {
    borderRadius: 0,
    borderRadius: 0,
    flex: 1,
    resizeMode: "stretch",
  },
  cardText: {
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    position: "absolute",
    bottom: 0,
    fontFamily: "Poppins_700Bold",
    padding: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#0298d3",
  },
});

export default BusinessScreen;
