import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  Share,
  Pressable,
  Alert,
  Platform,
  ImageBackground,
} from "react-native";
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { userGetKey, userSetKey } from "./../store/UserSlices";
import { notificationApi } from "./../store/NotificationSlices";
import { Details, Category, ShareIcon } from "../Navigation/Icon";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  ActivityIndicator,
  MD2Colors,
  FAB,
} from "react-native-paper";
import AppbarHeader from "../component/Appbar";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

const HomeScreen = ({ navigation, threshold = 100 }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const NOTELIST = useSelector((state) => state.notification.notification);
  const LODING = useSelector((state) => state.notification.loading);

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

  // useImperativeHandle(ref, () => ({
  //   // each key is connected to `ref` as a method name
  //   // they can execute code directly, or call a local method
  //   scrollToTop: () => { scrollToTop() },
  //   method2: () => { console.log("Remote method 2 executed") }
  // }))
  const onShare = async (url) => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  useFocusEffect(
    useCallback(() => {
      const onTabPress = (e) => {
        // Prevent default behavior
        e.preventDefault();
        // Trigger a re-render by updating the state
        scrollToTop();
      };
      const unsubscribe = navigation.addListener("tabPress", onTabPress);
      // async function requestUserPermission() {
      //   const authStatus = await messaging().requestPermission();
      //   const enabled =
      //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      //   if (enabled) {
      //     console.log("Authorization status:", authStatus);
      //   }
      // }
      // const unsubscribeLoad = messaging().onMessage(async remoteMessage => {
      //   // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage.data.type));
      //   // navigation.navigate("Accueil", "Dashboard");
      //   if(remoteMessage) {
      //     navigation.navigate(remoteMessage.data.type, JSON.stringify({ slug: remoteMessage.data.slug }))
      //   }
      // });

      // Clean up the event listener
      return () => {
        unsubscribe();
      };
    }, [navigation])
  );

  useEffect(() => {
    dispatch(notificationApi({ page: currantPage }));
    dispatch(userGetKey());
    setRefreshing(false);
    // if (isFocused) {
    //   console.log(props.route.name)
    //   scrollToTop();
    // //   console.log(navigation)
    // //   // if (navigation.isFocused()) ;
    // }
  }, [currantPage, refreshing]);

  onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <Card
        mode="elevation"
        elevation={5}
        style={{
          borderRadius: 0,
          backgroundColor: "#ffffff",
          marginBottom: 20,
        }}
      >
        <Card.Title
          title={item.notification_title}
          subtitle={item.notification_date_data}
          titleStyle={{ fontFamily: "Poppins_700Bold" }}
          subTitleStyle={{ fontFamily: "Poppins_400Regular" }}
        />
        <Pressable
          onPress={() =>
            navigation.navigate(
              item.notification_app_type,
              JSON.stringify({ slug: item.notification_all_slug })
            )
          }
        >
          <ImageBackground
            source={
              item.notification_image
                ? { uri: item.notification_image }
                : require("../assets/noImage.png")
            }
            // blurRadius={10}
            resizeMode={`contain`}
            style={{ flex: 1, justifyContent: "center", height: 370 }}
          >
            {/* <Card.Cover
              source={
                item.notification_image
                  ? { uri: item.notification_image }
                  : require("../assets/noImage.png")
              }
              // resizeMode="contain"
              style={{ borderRadius: 0, height: 370 }}
            /> */}
          </ImageBackground>
        </Pressable>
        <Card.Actions>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <Details />}
            style={{ width: "50%", alignItems: "flex-start", paddingStart: 12 }}
            onPress={() =>
              navigation.navigate(
                item.notification_app_type,
                JSON.stringify({ slug: item.notification_all_slug })
              )
            }
          >
            En savoir plus
          </Button>
          <Button
            mode="text"
            textColor="#666666"
            icon={() => <ShareIcon />}
            style={{ width: "50%", alignItems: "flex-end" }}
            onPress={() => onShare(item.notification_url)}
          >
            Partager
          </Button>
        </Card.Actions>
      </Card>
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
  noItemDisplay = () => {
    return (
      NOTELIST && (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image
            style={{ width: 500, height: 500 }}
            source={require("../assets/noData.png")}
          />
        </View>
      )
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Accueil"
        logo={true}
        back={false}
        home={false}
        navigation={navigation}
      />
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
        data={NOTELIST}
        renderItem={this._renderItem}
        ListEmptyComponent={this.noItemDisplay}
        keyExtractor={(item) => item.notification_id}
        numColumns={1}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshing={refreshing}
        initialNumToRender={10}
        onRefresh={() => {
          setRefreshing(true);
          setCurrantPage(1);
        }}
      />
      {/* {isVisible && (
        <FAB
          icon="arrow-up"
          style={styles.fab}
          onPress={scrollToTop}
          color="#ffffff"
        />
      )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)",
    padding: 0,
    margin: 0,
  },
  view: {
    flex: 1,
    padding: 15,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#0298d3",
  },
});

export default HomeScreen;
