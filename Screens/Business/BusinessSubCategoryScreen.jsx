import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ImageBackground
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Avatar, Button, Card, Surface, ActivityIndicator, MD2Colors, Badge, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { businessSubCategoryApi } from "../../store/business/BusinessSubCategorySlices";
import AppbarHeader from "../../component/Appbar"


const BusinessSubCategoryScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const SUBCATEGORY = useSelector(state => state.subcategoryapi.subcategory);
  const LODING = useSelector(state => state.subcategoryapi.loading);
  const routeData = JSON.parse(route.params);

  useEffect(() => {
    dispatch(businessSubCategoryApi({ page: currantPage, id: routeData.directory_category_id }));
  }, [currantPage])
  onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true
    }
  }
  const renderLoder = () => {
    return (
      LODING && (
        <View>
          <ActivityIndicator animating={true} color={MD2Colors.blue100} size={40} style={{ marginTop: 30 }} />
        </View>
      )
    )
  }
  _renderItem = ({ item }) => (
    <View style={{ flex: 0.5, margin: 10, width: "100%" }}>
      <Pressable style={styles.card} onPress={() => { item.subcategory_count > 0 && navigation.navigate('BusinessList', JSON.stringify(item)) }}>
        {/* { item.subcategory_count > 0 && <Badge style={{ position: 'absolute', top: -4, right: -4, zIndex: 5 }}>{item.subcategory_count}</Badge>} */}
        <Card style={{ borderRadius: 0, backgroundColor: "rgba(0,0,0,0)" }} elevation={0}>
          <Card.Cover
            source={item.directory_subcategory_icon !== null ? { uri: item.directory_subcategory_icon } : require('../../assets/noImage.png')}
            style={[styles.Cover, { aspectRatio: 300 / 300, height: undefined, width: '100%' }]}
          />
          {/* <ImageBackground
            source={
              item.directory_subcategory_icon !== null
                ? { uri: item.directory_subcategory_icon }
                : require("../../assets/noImage.png")
            }
            // blurRadius={10}
            resizeMode={`contain`}
            style={styles.Cover}
          /> */}
          {/* <Card.Content> */}
          <Text style={styles.cardText}>
            {item.directory_subcategory_title}
          </Text>
          {/* </Card.Content> */}
        </Card>
      </Pressable>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader title={routeData.directory_category_title} back={true} home={true} navigation={navigation} />
      <FlatList
        showsVerticalScrollIndicator={true}
        onEndReachedThreshold={0}
        onEndReached={this.onEndReachedHandler}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false }}
        ListFooterComponent={renderLoder}
        data={SUBCATEGORY}
        renderItem={this._renderItem}
        keyExtractor={(item) => item.directory_subcategory_id}
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
  ScrollView: {
    flex: 1,
    padding: 15
  },
  card: {
    backgroundColor: "rgba(248, 248, 248, 1)",
    padding: 0
  },
  Cover: {
    width: 176,
    height: 176,
    borderRadius: 0,
    borderRadius: 0,
    flex: 1,
    resizeMode: 'stretch',
  },
  cardText: {
    width: '100%',
    textAlign: "center",
    fontSize: 12,
    position: 'absolute',
    bottom: 0,
    fontFamily: 'Poppins_700Bold',
    padding: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#0298d3'
  },
});

export default BusinessSubCategoryScreen;
