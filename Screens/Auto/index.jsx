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
import { autoApi, autoFilterListApi } from "../../store/AutoSlices";
import CardAutoImmobilier from "../../component/CardAutoImmobilier";
const AutoScreen = ({ navigation, threshold = 100 }) => {
  const g = require("../../Navigation/Style");
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const AUTOLIST = useSelector((state) => state.auto.autos);
  // const AUTODROPDOWN = useSelector(state => state.auto.autoList);
  const [AUTODROPDOWN, setAUTODROPDOWN] = useState("");
  const LODING = useSelector((state) => state.auto.loading);

  const [modalAll, setModalAll] = useState("");
  const [listdata, setListdata] = useState(true)
  //Model
  const [toggleOpen, setToggleOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [model, setModel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [fule, setFule] = useState("");
  const [year, setYear] = useState("");
  const [min, setMin] = useState(10);
  const [max, setMax] = useState(90000000000);
  const [checked, setChecked] = useState("");

  const filter = () => {
    let data = JSON.stringify({
      city: city,
      brand: brand,
      model: model,
      gearbox: gearbox,
      fuel: fule,
      year: year,
      min_price: min,
      max_price: max,
      type: checked,
    });
    setListdata(false)
    dispatch(autoApi({ data: data, page: 1, type: true })).then(
      () => {
        setToggleOpen(false);
      }
    );
  };

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
      dispatch(autoApi({ page: currantPage, type: false })).then(() => {
        setRefreshing(false);
      });
    }
    dispatch(autoFilterListApi()).then((req) => {
      setAUTODROPDOWN(req.payload);
      setModalAll(req.payload.car_model);
    });
  }, [currantPage, refreshing]);
  const brandLoad = (item) => {
    setBrand(item.value);
    let model = AUTODROPDOWN.car_model.filter(
      (data) => data.brand_id == item.value
    );
    setModalAll(model);
  };

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
        other={true}
        footerText={false}
        details={"AutosDetails"}
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
      AUTOLIST && (
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
    setBrand("");
    setCity("");
    setModel("");
    setGearbox("");
    setFule("");
    setYear("");
    setMin(10);
    setMax(90000000000);
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
            title="Auto Filtre"
            titleStyle={{ fontSize: 18, fontFamily: "Poppins_700Bold" }}
          />
          <Appbar.Action icon="close" onPress={() => toggleOpenFuc(false)} />
        </Appbar.Header>
        <ScrollView
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          style={{ padding: 10 }}
        >
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.city : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Ville"
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
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.car_brand : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Marque"
            searchPlaceholder="Search..."
            value={brand}
            onChange={(item) => {
              console.log(item)
              brandLoad(item)
            }}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={modalAll != "" ? modalAll : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Modèle"
            searchPlaceholder="Search..."
            value={model}
            onChange={(item) => {
              setModel(item.value);
            }}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.car_gearbox : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Boîte de Vitesse"
            searchPlaceholder="Search..."
            value={gearbox}
            onChange={(item) => {
              setGearbox(item.value);
            }}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.car_fule : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Carburant"
            searchPlaceholder="Search..."
            value={fule}
            onChange={(item) => {
              setFule(item.value);
            }}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.car_year : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Année"
            searchPlaceholder="Search..."
            value={year}
            onChange={(item) => {
              setYear(item.value);
            }}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.car_min_price : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Prix min"
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
            data={AUTODROPDOWN != "" ? AUTODROPDOWN.car_max_price : []}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Prix max"
            searchPlaceholder="Search..."
            value={max}
            onChange={(item) => {
              setMax(item.value);
            }}
          />
          <View>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setChecked(checked == newValue ? '' : newValue);
              }}
              value={checked}
            >
              {AUTODROPDOWN.car_type &&
                AUTODROPDOWN.car_type.map((data, i) => {
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
        </ScrollView>
        <View
          style={{
            padding: 10,
            backgroundColor: "#ffffff",
            flexDirection: "row",
          }}
        >
          <Button
            style={[g.Btn, { marginRight: 10, width: "49%" }]}
            mode="contained"
            onPress={() => filter()}
          >
            Rechercher
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
        title="Auto"
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
            data={AUTOLIST}
            renderItem={this._renderItem}
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
              setBrand("");
              setCity("");
              setModel("");
              setGearbox("");
              setFule("");
              setYear("");
              setMin(10);
              setMax(90000000000);
              setChecked("");
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
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    fontFamily: "Poppins_400Regular",
  },
  dropdown: {
    marginBottom: 15,
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
export default AutoScreen;
