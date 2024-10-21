import React, { useEffect, useState } from "react";
import * as Linking from 'expo-linking';
import { SafeAreaView, StyleSheet, Alert, View, Pressable, Image } from "react-native";
import { IconButton, Avatar, Card, FAB, ToggleButton, ActivityIndicator, MD2Colors, Text } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Address, Phone, Email, Website, Share, Location } from "../../Navigation/Icon";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppbarHeader from "../../component/Appbar";
import BusinessHomeRoute from "./BusinessHomeRoute";
import BusinessAboutRoute from "./BusinessAboutRoute";
import BusinessPostRoute from "./BusinessPostRoute";
import BusinessVideoRoute from "./BusinessVideoRoute";
import BusinessLocationRoute from "./BusinessLocationRoute";
import BusinessOthersRoute from "./BusinessOthersRoute";
import BusinessPhotoRoute from "./BusinessPhotoRoute";

import { businessDetailsApi } from "../../store/business/BusinessDetailsSlices"



const BusinessDetailsScreen = ({ navigation, route }) => {

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return <BusinessHomeRoute navigation={navigation} />;
      case 'about':
        return <BusinessAboutRoute navigation={navigation} />;
      case 'post':
        return <BusinessPostRoute navigation={navigation} />;
      case 'photo':
        return <BusinessPhotoRoute navigation={navigation} />;
      case 'video':
        return <BusinessVideoRoute navigation={navigation} />;
      case 'location':
        return <BusinessLocationRoute navigation={navigation} />;
      case 'other':
        return <BusinessOthersRoute navigation={navigation} />;
      default:
        return null;
    }
  };
  const dispatch = useDispatch();
  const routeData = JSON.parse(route.params);
  // const BUSINESSHOME = useSelector(state => state.businessDetails.businesshome);
  // const LODING = useSelector(state => state.business.loading);
  const [BUSINESSHOME, setBUSINESSHOME] = useState("")
  const [videoCount, setVideo] = useState('');
  const [other, setOther] = useState('')
  const [loding, setLoding] = useState(false)

  const [index, setIndex] = React.useState(0);

  // const [listTab] = React.useState();
  const [routes, setRoutes] = React.useState([]);
  const renderIcon = ({ route, color }) => (
    <Ionicons name={route.icon} size={24} color={color} />
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={stylesList.indicator}
      renderIcon={renderIcon}
      tabStyle={stylesList.tabbar}
    />
  );

  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const { open } = state;

  useEffect(() => {
    setLoding(true)
    dispatch(businessDetailsApi({ slug: routeData.slug })).then((req) => {
      setRoutes(req.payload.tabs)
      setBUSINESSHOME(req.payload.data);
      setLoding(false);
    })

  }, [])
  return (
    <SafeAreaView style={stylesList.container}>
      <AppbarHeader title="Détails de l'entreprise" back={true} home={true} navigation={navigation} />
      {loding && <ActivityIndicator animating={true} color={MD2Colors.blue100} size={40} style={{ marginTop: 30 }} />}
      {
        BUSINESSHOME &&
        <Card
          mode="elevation"
          elevation={5}
          style={{
            borderRadius: 0,
            backgroundColor: "#56b5db33",
            // marginTop: 10,
          }}
        >
          <Card.Title
            title={BUSINESSHOME.directory_title}
            titleStyle={{ fontFamily: 'Poppins_700Bold' }}
            // subtitle={BUSINESSHOME.directory_paid}
            // subtitleStyle={{color: BUSINESSHOME.directory_paid == 'paid' ? 'green' : 'red'}}
            left={() => (
              <Avatar.Image
                size={48}
                source={BUSINESSHOME.logo ? { uri: BUSINESSHOME.logo } : require("../../assets/noImage.png")}
              />
            )}
            // right={(props) =>
            //   // <ToggleButton.Row {...props}>
            //   //   {BUSINESSHOME.directory_facebook !== "" && <IconButton icon="facebook" style={stylesList.ToggleButton} iconColor='#4267B2' size={26} onPress={() => Linking.openURL(BUSINESSHOME.directory_facebook)} />}
            //   //   {BUSINESSHOME.directory_twitter !== "" && <IconButton icon={{ uri: 'https://api.moncongo.com/upload/sites/twitter.png'}} style={stylesList.ToggleButton} size={26} onPress={() => Linking.openURL(BUSINESSHOME.directory_twitter)} />}
            //   //   {BUSINESSHOME.directory_instagram !== "" && <IconButton icon="instagram" style={stylesList.ToggleButton} iconColor='#E1306C' size={26} onPress={() => Linking.openURL(BUSINESSHOME.directory_instagram)} />}
            //   //   {BUSINESSHOME.directory_linkdin !== "" && <IconButton icon="linkedin" style={stylesList.ToggleButton} iconColor='#0A66C2' size={26} onPress={() => Linking.openURL(BUSINESSHOME.directory_linkdin)} />}
            //   //   {BUSINESSHOME.directory_youtube !== "" && <IconButton icon="youtube" style={stylesList.ToggleButton} iconColor='#E1306C' size={26} onPress={() => Linking.openURL(BUSINESSHOME.directory_youtube)} />}
            //   // </ToggleButton.Row>
              
            // }
          />
        </Card>
      }
      {
        BUSINESSHOME.directory_paid == 'paid' && <TabView
          lazy
          navigationState={{
            index,
            routes
          }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
        />
      }
      {
        BUSINESSHOME.directory_paid == 'unpaid' && <View style={stylesList.info}>
          {
            BUSINESSHOME.directory_address && <View style={{ paddingVertical: 5, flexDirection: 'row' }}><Location size={24} color='white' /><Text style={stylesList.text}>{BUSINESSHOME.directory_address}</Text></View>
          }
          {
            BUSINESSHOME.directory_contact[0].contact != "" && BUSINESSHOME.directory_contact.map((value, i) => {
              return <Pressable key={i} onPress={() => Linking.openURL(`tel:${value.contact}`)} style={{ paddingVertical: 5, flexDirection: 'row' }}><Phone size={21} color='white' /><Text style={stylesList.text}>{value.contact}</Text></Pressable>
            })
          }
          {
            BUSINESSHOME.directory_email && Object.entries(BUSINESSHOME.directory_email[0]).map(([key, value], i) => {
              return value && <Pressable key={i} onPress={() => Linking.openURL(`mailto:${value}`)} style={{ paddingVertical: 10, flexDirection: 'row' }}><Email size={21} color='white' /><Text style={stylesList.text}>{value}</Text></Pressable>
            })
          }
          {
            BUSINESSHOME.directory_website_url && <Pressable onPress={() => Linking.openURL(BUSINESSHOME.directory_website_url)} style={{ paddingVertical: 10, flexDirection: 'row' }}><Website size={21} color='white' /><Text style={stylesList.text}>{BUSINESSHOME.directory_website_url}</Text></Pressable>
          }
        </View>
      }

      <FAB.Group
        open={open}
        visible
        icon={open ? 'close' : 'contacts-outline'}
        backdropColor="rgba(0,0,0,0)"
        color="#ffffff"
        fabStyle={{ backgroundColor: '#0298d3' }}
        actions={[
          {
            icon: 'email',
            label: 'Email',
            color: '#ffffff',
            style: { backgroundColor: '#0298d3' },
            onPress: () => BUSINESSHOME.directory_email[0].email !== "" ? Linking.openURL(`mailto:${BUSINESSHOME.directory_email[0].email}`) : Alert.alert('Désolé! Aucune adresse e-mail trouvée'),
            labelStyle: stylesList.fabLabelStyle
          },
          {
            icon: 'phone',
            label: 'Appel',
            color: '#ffffff',
            style: { backgroundColor: '#0298d3' },
            onPress: () => BUSINESSHOME.directory_contact.length > 0 ? Linking.openURL(`tel:${BUSINESSHOME.directory_contact[0].contact}`) : Alert.alert('Désolé! Aucun numéro de contact trouvé'),
            labelStyle: stylesList.fabLabelStyle
          },
          {
            icon: 'whatsapp',
            label: 'WhatsApp',
            onPress: () => BUSINESSHOME.directory_whatsapp !== "" ? Linking.openURL(`https://wa.me/${BUSINESSHOME.directory_whatsapp}`) : Alert.alert('Désolé! Aucun contact WhatsApp trouvé'),
            color: '#ffffff',
            style: { backgroundColor: '#64B161' },
            labelStyle: stylesList.fabLabelStyle
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </SafeAreaView>
  );
}

const stylesList = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(248, 248, 248, 1)"
  },
  ScrollView: {
    flex: 1,
    padding: 10
  },
  header: {
    backgroundColor: "#ffffff",
  },
  tabbar: {
    backgroundColor: '#0298d3',
    paddingHorizontal: 0,
    bottom: 0
    // paddingVertical: 5
  },
  indicator: {
    backgroundColor: '#0298d3',
    paddingVertical: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(248, 248, 248, 0)"
  },
  fabLabelStyle: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20
  },
  ToggleButton: {
    // backgroundColor: '#fff',
    margin: 0,
  },
  info: {
    // flex: 1,
    backgroundColor: '#0298d3',
    paddingHorizontal: 20,
    paddingVertical: 20,
    margin: 10,
  },
  text: {
    paddingHorizontal: 11,
    color: 'white',
  }
});

export default BusinessDetailsScreen;
