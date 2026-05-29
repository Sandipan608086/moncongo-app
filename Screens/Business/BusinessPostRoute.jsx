import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  useWindowDimensions,
  RefreshControl
} from "react-native";
import { Appbar, Avatar, Button, Card, Surface, SegmentedButtons, ActivityIndicator, MD2Colors } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { businessPostListApi } from "../../store/business/BusinessListSlices"
const BusinessPostRoute = (props) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('announcement');
  const [slugValue, setSlug] = useState('AnnouncementDetails');
  const [currantPage, setCurrantPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const BUSINESSHOME = useSelector(state => state.businessDetails.businesshome);
  const BUSINESSPOSTLIST = useSelector(state => state.businesslistdata.businesslistPost);
  const LODING = useSelector(state => state.business.loading);
  const onEndReachedCalledDuringMomentum = useRef(true);
  useEffect(() => {
    dispatch(
      businessPostListApi({
        page: currantPage,
        id: BUSINESSHOME.directory_id,
        type: value
      })
    )
    setRefreshing(false);
  }, [value, currantPage, refreshing])
  const onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true
    }
  }
  const _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%", marginBottom: 15 }}>
      <Card onPress={() => props.navigation.navigate(slugValue, JSON.stringify({ slug: item.slug }))}>
        <Card.Title
          title={item.title}
          titleStyle={{ fontFamily: 'Poppins_700Bold' }}
          subtitle={item.description}
          left={({ size, color }) => (
            <Image alt="image" style={{ width: size, height: size, tintColor: color }} source={item.list_img ? { uri: item.list_img } : require("../../assets/noImage.png")} />
          )}
        />
      </Card>
    </View>
  );
  const renderLoder = () => {
    return (
      LODING && (
        <View>
          <ActivityIndicator animating={true} color={MD2Colors.blue100} size={40} style={{ marginTop: 30 }} />
        </View>
      )
    )
  }
  return (
    <View style={styles.ScrollView}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'announcement',
            label: 'Annonces',
            onPress: () => setSlug('AnnouncementDetails')
          },
          {
            value: 'promotions',
            label: 'Promotions',
            onPress: () => setSlug('PromotionsDetails')
          },
          {
            value: 'events',
            label: 'Événements',
            onPress: () => setSlug('EventsDetails')
          }
        ]}
      />
      {BUSINESSPOSTLIST.length > 0 ? <FlatList
        showsVerticalScrollIndicator={true}
        onEndReachedThreshold={0}
        onEndReached={onEndReachedHandler}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false }}
        ListFooterComponent={renderLoder}
        data={BUSINESSPOSTLIST}
        renderItem={_renderItem}
        keyExtractor={(item) => item.id_key}
        numColumns={1}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true)
          setCurrantPage(1)
        }}
      /> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Image alt="image" style={{ width: 500, height: 500 }} source={require('../../assets/noData.png')} /></View>}
    </View>
  )
}
const styles = StyleSheet.create({
  ScrollView: {
    flex: 1,
    padding: 10,
  },
})
export default BusinessPostRoute;

