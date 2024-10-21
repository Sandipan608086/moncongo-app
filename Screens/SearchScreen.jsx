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
  Platform,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  RadioButton,
  Card,
  Searchbar,
  Surface,
  ActivityIndicator,
  MD2Colors,
  FAB,
} from "react-native-paper";
import MenuDrawer from "react-native-side-drawer";
import AppbarHeader from "../component/Appbar";
import BusinessListCom from "../component/BusinessListCom";
import { useSelector, useDispatch } from "react-redux";
import { searchListApi } from "../store/business/SearchListSlices";
const SearchScreen = ({ navigation }) => {
  const g = require("../Navigation/Style");
  const dispatch = useDispatch();
  const onEndReachedCalledDuringMomentum = useRef(true);
  const [currantPage, setCurrantPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const SEARCHLIST = useSelector((state) => state.search.searchlist);
  const [CITYLIST, setCITYLIST] = useState("");
  const [LODING, setLODING] = useState(false);
  // const [LODING, setLODING] = useSelector(state => state.search.loading);

  const [toggleOpen, setToggleOpen] = useState(false);
  const [value, setValue] = useState("");
  const toggleOpenFuc = (e) => {
    setToggleOpen(e);
  };

  const [listCount, setListCount] = useState("");
  const [listData, setListData] = useState();
  const onChangeSearch = (query) => {
    setLODING(true);
    setSearchQuery(query);
    console.log(query);
    if (query) {
      dispatch(searchListApi({ page: 1, search: query, cityId: value })).then(
        (req) => {
          setListData(req.payload.api.data);
          setListCount(req.payload.api.count);
          setCITYLIST(req.payload.api.cityfilters);
          setValue("");
          setLODING(false);
        }
      );
    } else {
      setTimeout(() => {
        setListData("");
        setListCount(0);
        setCITYLIST("");
        setValue("");
        setLODING(false);
      }, 1000);
    }
  };
  // const onLoadSearch = (query) => {
  //   setLODING(true);
  //   setSearchQuery(query);
  //   query !== "" &&
  //     dispatch(
  //       searchListApi({ page: currantPage, search: query, cityId: value })
  //     ).then((req) => {
  //       setListData(req.payload.api.data);
  //       setListCount(req.payload.api.count);
  //       setCITYLIST(req.payload.api.cityfilters);
  //       setLODING(false);
  //     });
  // };
  const filter = () => {
    setLODING(true);
    if (searchQuery) {
      dispatch(
        searchListApi({ page: 1, search: searchQuery, cityId: value })
      ).then((req) => {
        setListData(req.payload.api.data);
        setListCount(req.payload.api.count);
        setCITYLIST(req.payload.api.cityfilters);
        toggleOpenFuc(false);
        setLODING(false);
      });
    }
  };
  const onClearIconPress = () => {
    setLODING(true);
    setListData("");
    setListCount(0);
    setLODING(false);
  };
  useEffect(() => {
    // currantPage > 1 &&
    // onLoadSearch(searchQuery);
    // return () => { }
  }, [currantPage]);
  onEndReachedHandler = ({ distanceFromEnd }) => {
    if (!onEndReachedCalledDuringMomentum.current) {
      setCurrantPage(currantPage + 1);
      onEndReachedCalledDuringMomentum.current = true;
    }
  };
  _renderItem = ({ item }) => (
    <View style={{ flex: 1, width: "100%" }}>
      <BusinessListCom data={item} navigation={navigation} />
    </View>
  );
  renderLoder = () => {
    return (
      LODING == true && (
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
    return searchQuery != "" ? (
      listData === null && (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Image
            style={{ width: 500, height: 500 }}
            source={require("../assets/noData.png")}
          />
        </View>
      )
    ) : (
      <View
        style={[g.Content, { marginTop: 150 }]}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text style={{ textAlign: "center", paddingHorizontal: 10 }}>
          Plus de 3 000 entreprises sont présentes sur MonCongo. Si vous ne
          savez pas quoi chercher, n'hésitez pas à explorer notre annuaire
          d'entreprises
        </Text>
        <Button
          style={[g.Btn, { marginBottom: 100 }]}
          mode="contained"
          onPress={() => navigation.navigate("Business")}
        >
          RÉPÉRTOIRE
        </Button>
      </View>
    );
  };
  drawerContent = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(248, 248, 248, 1)",
          marginTop: 70,
        }}
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
              {CITYLIST != "" &&
                CITYLIST.map((data, i) => {
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
            disabled={LODING}
            loading={LODING}
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
    <SafeAreaView style={styles.container}>
      <AppbarHeader
        title="Recherche"
        back={false}
        home={false}
        logo={true}
        navigation={navigation}
      />

      <Searchbar
        placeholder="Rechercher des entreprises"
        onChangeText={onChangeSearch}
        onClearIconPress={onClearIconPress}
        value={searchQuery}
        style={{ margin: 15, marginBottom: 0 }}
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
            showsVerticalScrollIndicator={true}
            onEndReachedThreshold={0}
            onEndReached={this.onEndReachedHandler}
            onMomentumScrollBegin={() => {
              onEndReachedCalledDuringMomentum.current = false;
            }}
            ListFooterComponent={this.renderLoder}
            ListEmptyComponent={this.noItemDisplay}
            data={listData}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.directory_id}
            numColumns={1}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
          />
          {searchQuery != "" && (
            <FAB
              color="#ffffff"
              icon="filter"
              style={styles.fab}
              onPress={() => toggleOpenFuc(true)}
            />
          )}
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
  view: {
    flex: 1,
    padding: 15,
  },
  searchbar: {
    flex: 1,
    padding: 15,
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

export default SearchScreen;
