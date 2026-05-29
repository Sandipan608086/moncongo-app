import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  ScrollView,
  Image,
  Dimensions,
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
import { jobsApi, jobsCategory } from "../../store/JobsSlices";
import CardComponent from "../../component/CardComponent";
const JobsScreen = ({ navigation, threshold = 100 }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const { height } = Dimensions.get("screen");
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [category, setCategoryPage] = useState(0);
  const [type, setTypePage] = useState("allJobs");
  const [value, setValue] = useState("");
  // const [modalVisible, setModalVisible] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const JOBSLIST = useSelector((state) => state.job.jobs);
  const CATEGORYLIST = useSelector((state) => state.job.category);
  const LODING = useSelector((state) => state.job.loading);

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
      jobsApi({
        page: currantPage,
        categoryId: category,
        type: type,
      })
    );
    dispatch(jobsCategory());
    setRefreshing(false);
  }, [currantPage, refreshing, category, type]);
  const filter = () => {
    if (value != "") {
      setCurrantPage(1);
      setCategoryPage(value);
      setTypePage("searchJobs");
      setToggleOpen(false);
      // setModalVisible(!modalVisible)
    } else {
      Alert.alert("Please select a category to filter");
    }
  };
  const onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardComponent
        item={item}
        navigation={navigation}
        button={true}
        details={"JobDetails"}
      />
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
      !JOBSLIST && (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image alt="image"
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
      <View
        style={{
          backgroundColor: "rgba(248, 248, 248, 1)",
          flex: 1,
        }}
        elevation={6}
      >
        <Appbar.Header statusBarHeight={Platform.OS === "ios" ? 80 : 0}>
          <Appbar.Content
            category="h1"
            title="Jobs Filter"
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
                setValue(value == newValue ? '' : newValue);
              }}
              value={value}
            >
              {CATEGORYLIST.map((data, i) => {
                return (
                  // <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  //     <RadioButton value={data.job_category_id} color={"#0298d3"} />
                  //     <Text>{data.job_category_title}</Text>
                  // </View>
                  <View key={i} style={{ flexDirection: "row" }}>
                    <RadioButton.Item
                      value={data.job_category_id}
                      label={data.job_category_title}
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
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Button
              //icon="filter"
              style={[g.Btn, { marginRight: 10, width: "49%" }]}
              mode="contained"
              onPress={() => filter()}
            >
              Filter
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
              Clear
            </Button>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Jobs"
        back={true}
        home={true}
        navigation={navigation}
      />
      <View
        style={{
          marginTop: 0,
          flex: 1,
          justifyContent: "flex-end",
          // alignItems: "center",
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
              onEndReached={onEndReachedHandler}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              ListFooterComponent={renderLoder}
              data={JOBSLIST}
              renderItem={_renderItem}
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
                setTypePage("allJobs");
                setValue("");
              }}
            />
          {/*{isVisible && <FAB
                    icon="arrow-up"
                    style={styles.fab}
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
});
export default JobsScreen;
