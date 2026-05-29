import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Platform,
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
  RadioButton,
} from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import MenuDrawer from "react-native-side-drawer";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import {
  propertyApi,
  propertyFilterDropdownApi,
} from "../../store/PropertySlices";
import CardAutoImmobilier from "../../component/CardAutoImmobilier";
const PropertyScreen = ({ navigation, threshold = 100 }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [currantPageLoad, setCurrantPageLoad] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const PROPERTYLIST = useSelector((state) => state.property.property);
  // const PROPERTYDROPDOWN = useSelector(state => state.property.propertyDropdown);
  const [PROPERTYDROPDOWN, setPROPERTYDROPDOWN] = useState("");
  const LODING = useSelector((state) => state.property.loading);
  //Model
  const [toggleOpen, setToggleOpen] = useState(false);
  const [city, setCity] = useState("");
  const [listtype, setListtype] = useState("");
  const [person, setPerson] = useState("");
  const [min, setMin] = useState(10);
  const [max, setMax] = useState(90000000000);
  const [bedrooms, setBedrooms] = useState("");
  const [checked, setChecked] = useState("");

  // const [jsonfilter, setJsonfilter] = useState({});
  const [listdata, setListdata] = useState(true);

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
    if(listdata === true) {
      dispatch(propertyApi({ page: currantPage, type: false })).then((req) => {
        setRefreshing(false);
      });
    }
    // if(refreshing === true) {
    //   dispatch(
    //     propertyApi({ data: jsonfilter, page: currantPageLoad, type: true })
    //   ).then(() => {
    //     toggleOpenFuc(false);
    //   });
    // }

    dispatch(propertyFilterDropdownApi()).then((req) => {
      setPROPERTYDROPDOWN(req.payload);
    });
  }, [currantPage, refreshing]);

  const filter = () => {
    let data = JSON.stringify({
      city: city,
      listtype: listtype,
      person: person,
      min_price: min,
      max_price: max,
      bedroom: bedrooms,
      type: checked,
    });
    setListdata(false)
    dispatch(
      propertyApi({ data: data, page: 1, type: true })
    ).then(() => {
      toggleOpenFuc(false);
    });
  };

  const onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      // currantPageLoad > 1 && setCurrantPageLoad(currantPageLoad + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  const _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <CardAutoImmobilier
        item={item}
        navigation={navigation}
        brand={false}
        payment={true}
        other={true}
        footerText={false}
        details={"PropertyDetails"}
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
      PROPERTYLIST && (
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
    setListtype("");
    setPerson("");
    setCity("");
    setMin(10);
    setMax(90000000000);
    setBedrooms("");
    setChecked("");
  };
  drawerContent = () => {
    return (
      <View
        style={{ flex: 1, backgroundColor: "rgba(248, 248, 248, 1)" }}
        elevation={6}
      >
        <Appbar.Header statusBarHeight={Platform.OS === "ios" ? 80 : 0}>
          <Appbar.Content
            title="Properties Filter"
            titleStyle={{ fontSize: 18, fontFamily: "Poppins_700Bold" }}
          />
          <Appbar.Action icon="close" onPress={() => toggleOpenFuc(false)} />
        </Appbar.Header>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          style={{ padding: 10 }}
        >
          <View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={PROPERTYDROPDOWN ? PROPERTYDROPDOWN.listType : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Rent/Sell"
              searchPlaceholder="Search..."
              value={listtype}
              onChange={(item) => {
                setListtype(item.value);
              }}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={PROPERTYDROPDOWN ? PROPERTYDROPDOWN.person : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="People"
              searchPlaceholder="Search..."
              value={person}
              onChange={(item) => {
                setPerson(item.value);
              }}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={PROPERTYDROPDOWN ? PROPERTYDROPDOWN.city : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="City"
              searchPlaceholder="Search..."
              value={city}
              onChange={(item) => {
                setCity(item.value);
              }}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={PROPERTYDROPDOWN ? PROPERTYDROPDOWN.min_price : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Min price"
              searchPlaceholder="Search..."
              value={min}
              onChange={(item) => {
                setMin(item.value);
              }}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={PROPERTYDROPDOWN ? PROPERTYDROPDOWN.max_price : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="max price"
              searchPlaceholder="Search..."
              value={max}
              onChange={(item) => {
                setMax(item.value);
              }}
            />
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={PROPERTYDROPDOWN ? PROPERTYDROPDOWN.bedrooms : []}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Rooms"
              searchPlaceholder="Search..."
              value={bedrooms}
              onChange={(item) => {
                setBedrooms(item.value);
              }}
            />
            <View>
              <RadioButton.Group
                onValueChange={(newValue) => {
                  setChecked(checked == newValue ? "" : newValue);
                }}
                value={checked}
              >
                {PROPERTYDROPDOWN.category &&
                  PROPERTYDROPDOWN.category.map((data, i) => {
                    return (
                      <View key={i} style={{ flexDirection: "row" }}>
                        <RadioButton.Item
                          value={data.value}
                          label={data.label}
                          labelStyle={{ width: "90%", fontSize: 15 }}
                          color={"#0298d3"}
                        />
                      </View>
                    );
                  })}
              </RadioButton.Group>
            </View>
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
            icon="filter"
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
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Properties"
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
            onEndReached={onEndReachedHandler}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListFooterComponent={renderLoder}
            data={PROPERTYLIST}
            renderItem={_renderItem}
            ListEmptyComponent={this.noItemDisplay}
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
              setListdata(true)
              setRefreshing(true);
              setCurrantPage(1);
              setCity("");
              setListtype("");
              setPerson("");
              setMin(10);
              setMax(90000000000);
              setBedrooms("");
              setChecked("");
            }}
          />
          <FAB
            icon="filter"
            style={styles.fab}
            onPress={() => toggleOpenFuc(true)}
            color="#ffffff"
          />
        </MenuDrawer>
        {/*{isVisible && <FAB
                icon="arrow-up"
                style={styles.fab2}
                onPress={scrollToTop}
                color="#ffffff"
            />}*/}
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
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    // borderRadius: 0,
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    // alignItems: 'center',
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
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    fontFamily: "Poppins_400Regular",
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingStart: 10,
    fontFamily: "Poppins_400Regular",
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingStart: 10,
    fontFamily: "Poppins_400Regular",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
});
export default PropertyScreen;
